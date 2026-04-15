namespace EstoqueService.Models;


    public class Produto
    {
        public int Id { get; set; }
        public required string Descricao { get; set; }
        public int Saldo { get; set; }
    }

