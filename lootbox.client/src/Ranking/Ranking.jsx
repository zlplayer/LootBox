import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from 'lucide-react';

function RankingComponent() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/ranking/top-users');
      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }
      const data = await response.json();
      setRankings(data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <Badge variant="default" className="bg-yellow-500 text-white">
            <Trophy className="w-3 h-3 mr-1" />
            1 miejsce
          </Badge>
        );
      case 1:
        return (
          <Badge variant="default" className="bg-gray-400 text-white">
            <Medal className="w-3 h-3 mr-1" />
            2 miejsce
          </Badge>
        );
      case 2:
        return (
          <Badge variant="default" className="bg-amber-700 text-white">
            <Medal className="w-3 h-3 mr-1" />
            3 miejsce
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {index + 1} miejsce
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Ranking</h1>
          <p className="text-muted-foreground">
            Top 10 najcenniejszych przedmiotów wylosowanych przez graczy
          </p>
        </div>

        {/* Ranking List */}
        <div className="grid gap-4">
          {rankings.map((item, index) => (
            <Card key={index} className={`transition-all duration-200 hover:bg-accent ${index < 3 ? 'relative overflow-hidden' : ''}`}>
              {index < 3 && (
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-10"
                  style={{
                    background: index === 0 
                      ? 'linear-gradient(to right, #FFD700, transparent)'
                      : index === 1
                        ? 'linear-gradient(to right, #C0C0C0, transparent)'
                        : 'linear-gradient(to right, #CD7F32, transparent)'
                  }}
                />
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {item.userName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.userName}</span>
                      {getRankBadge(index)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={`data:image/png;base64,${item.itemImage}`}
                        alt={item.itemName}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <p className="text-sm font-medium truncate">{item.itemName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline"
                            style={{ backgroundColor: item.rarity, color: 'white' }}
                          >
                            {item.rarity}
                          </Badge>
                          <Badge variant="secondary">
                            {item.wearRating}
                          </Badge>
                          <Badge variant="default">
                            {item.typeItem}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {item.itemPrice.toFixed(2)} zł
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.addedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RankingComponent;