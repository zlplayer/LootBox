using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class UserBestItemDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string ItemImage { get; set; }
        public float ItemPrice { get; set; }
        public string Rarity { get; set; }
        public string WearRating { get; set; }
        public string TypeItem { get; set; }
        public DateTime AddedDate { get; set; }
    }
}
