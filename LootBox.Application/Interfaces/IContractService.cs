using LootBox.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Interfaces
{
    public interface IContractService
    {
        Task<ItemDto> ExecuteTradeUpContractAsync(List<int> equipmentIds, int userId);
    }
}
