using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using EstoqueService.Models;
using EstoqueService.Data;
using EstoqueService.DTOs;

namespace EstoqueService.Controllers;

[ApiController]
[Route("produtos")]

    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProdutosController(AppDbContext context) {
            _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Criar(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return Ok(produto);
    }

    [HttpPost("estoque/baixar-lote")]

    public async Task<IActionResult> BaixarEstoque(BaixaEstoqueRequest request)
    {
        if (request.Itens == null || !request.Itens.Any())
            return BadRequest("Lista de itens vazia");
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var produtosParaAtualizar = new List<(Produto produto, int quantidade)>();

            foreach(var item in request.Itens)
            {
                var produto = await _context.Produtos.FindAsync(item.ProdutoId);
                if (produto == null)
                {
                    await transaction.RollbackAsync();
                    return NotFound($"Produto {item.ProdutoId} não encontrado");
                }

                if (produto.Saldo < item.Quantidade)
                {
                    await transaction.RollbackAsync();
                    return BadRequest($"Estoque insuficiente para produto {item.ProdutoId}");
                }

                produtosParaAtualizar.Add((produto, item.Quantidade));
            }

            foreach(var item in produtosParaAtualizar)
            {
                item.produto.Saldo -= item.quantidade;
            }

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Ok(new
            {
                sucesso = true,
                produtosAtualizados = produtosParaAtualizar.Select(p => new
                {
                    id = p.produto.Id,
                    saldo = p.produto.Saldo
                })
            });
        }
        catch
        {
            await transaction.RollbackAsync();

            return StatusCode(500, "Erro interno");
        }
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var produtos = await _context.Produtos.ToListAsync();
        return Ok(produtos);
    }
    }
