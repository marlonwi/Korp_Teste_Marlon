namespace FaturamentoService.DTOs
{
    public class NotaRequest
    {
        public List<ItemNotaRequest> Itens { get; set; }
    }

    public class ItemNotaRequest
    {
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
    }
}
