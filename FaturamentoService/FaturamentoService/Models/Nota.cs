using System.Data;

namespace FaturamentoService.Models;

    public class Nota
    {
        public int Id { get; set; }
        public DateTime Data { get; set; }

        public string Status { get; set; }

        public List<ItemNota> Itens { get; set; } = new();
    }