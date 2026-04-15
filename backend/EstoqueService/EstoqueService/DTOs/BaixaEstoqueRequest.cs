namespace EstoqueService.DTOs;

    public class BaixaEstoqueRequest
    {
        public List <ItemBaixaRequest> Itens { get; set; }
    }

    public class ItemBaixaRequest
    {
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
    }

