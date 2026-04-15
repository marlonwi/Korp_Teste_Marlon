using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FaturamentoService.Data;
using FaturamentoService.Models;
using FaturamentoService.DTOs;

namespace FaturamentoService.Controllers;

[ApiController]
[Route("notas")]
public class FaturamentoController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;

    public FaturamentoController(AppDbContext context, HttpClient httpClient)
    {
        _context = context;
        _httpClient = httpClient;
    }

    [HttpPost]
    public async Task<IActionResult> CriarNota()
    {
        var nota = new Nota
        {
            Data = DateTime.Now,
            Status = "ABERTA",
            Itens = new List<ItemNota>()
        };

        _context.Notas.Add(nota);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = nota.Id,
            status = nota.Status
        });
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var notas = await _context.Notas
            .Include(n => n.Itens)
            .ToListAsync();

        var resultado = notas.Select(n => new
        {
            id = n.Id,
            status = n.Status,
            data = n.Data,
            itens = n.Itens.Select(i => new
            {
                produtoId = i.ProdutoId,
                quantidade = i.Quantidade
            })
        });

        return Ok(resultado);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorId(int id)
    {
        var nota = await _context.Notas
            .Include(n => n.Itens)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (nota == null) return NotFound();

        return Ok(new
        {
            id = nota.Id,
            status = nota.Status,
            data = nota.Data,
            itens = nota.Itens.Select(i => new
            {
                produtoId = i.ProdutoId,
                quantidade = i.Quantidade
            })
        });
    }

    [HttpPost("{id}/itens")]
    public async Task<IActionResult> AdicionarItens(int id, NotaRequest request)
    {
        if (request?.Itens == null || !request.Itens.Any())
            return BadRequest("Itens inválidos");

        var nota = await _context.Notas
            .Include(n => n.Itens)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (nota == null) return NotFound();

        if (nota.Status != "ABERTA")
            return BadRequest("Nota já fechada");

        foreach (var item in request.Itens)
        {
            nota.Itens.Add(new ItemNota
            {
                ProdutoId = item.ProdutoId,
                Quantidade = item.Quantidade
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = nota.Id,
            status = nota.Status,
            itens = nota.Itens.Select(i => new
            {
                produtoId = i.ProdutoId,
                quantidade = i.Quantidade
            })
        });
    }

    [HttpPost("{id}/fechar")]
    public async Task<IActionResult> FecharNota(int id)
    {
        var nota = await _context.Notas
            .Include(n => n.Itens)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (nota == null) return NotFound();

        if (nota.Status != "ABERTA")
            return BadRequest("Nota já fechada");

        if (nota.Itens == null || !nota.Itens.Any())
            return BadRequest("Nota sem itens");

        var request = new NotaRequest
        {
            Itens = nota.Itens.Select(i => new ItemNotaRequest
            {
                ProdutoId = i.ProdutoId,
                Quantidade = i.Quantidade
            }).ToList()
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync(
                "http://localhost:5156/produtos/estoque/baixar-lote",
                request
            );

            if (!response.IsSuccessStatusCode)
            {
                var erro = await response.Content.ReadAsStringAsync();
                return BadRequest(erro);
            }

            nota.Status = "FECHADA";
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = nota.Id,
                status = nota.Status
            });
        }
        catch
        {
            return StatusCode(500, "Erro ao comunicar com estoque");
        }
    }
}