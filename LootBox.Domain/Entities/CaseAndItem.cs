using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Domain.Entities
{
    public class CaseAndItem
    {
        public int Id { get; set; }

        [ForeignKey("Case")]
        public int CaseId { get; set; }
        public Case? Case { get; set; }

       
        [ForeignKey("Item")]
        public int ItemId { get; set; }
        public Item? Item { get; set; }

        public DateTime Added { get; set; } = DateTime.Now;
    }
}
