import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabase = createClient(
  "https://minmoqfxjpwdqfccfebp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbm1vcWZ4anB3ZHFmY2NmZWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NDMwMzQsImV4cCI6MjA2NTAxOTAzNH0.6_QbHyVwyrpD1uUkS1StDNdmHClI415zuBVwTr4YXHg"
);

export default function TicketCalculator() {
  const [matches, setMatches] = useState([{ match: "", tip: "", odd: "" }]);
  const [stake, setStake] = useState("");
  const [tipster, setTipster] = useState("");
  const [totalOdds, setTotalOdds] = useState(1);
  const [potentialWin, setPotentialWin] = useState(0);

  const calculate = () => {
    const numericOdds = matches.map((m) => parseFloat(m.odd) || 1);
    const total = numericOdds.reduce((acc, val) => acc * val, 1);
    const win = total * parseFloat(stake || 0);
    setTotalOdds(total.toFixed(2));
    setPotentialWin(win.toFixed(2));
  };

  const addTicket = async () => {
    const ticket = {
      matches,
      stake,
      tipster,
      totalOdds,
      potentialWin,
      ticketType: getTicketType(matches.length),
      date: new Date().toISOString(),
      status: "nedovrsen",
    };
    await supabase.from("tickets").insert(ticket);
    setMatches([{ match: "", tip: "", odd: "" }]);
    setStake("");
    setTipster("");
    setTotalOdds(1);
    setPotentialWin(0);
  };

  const getTicketType = (length) => {
    if (length === 1) return "singl";
    if (length === 2) return "dubl";
    if (length === 3) return "tripl";
    return `${length}x`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <Card>
        <CardContent className="space-y-4 pt-4">
          <Label>Ulog (unit)</Label>
          <Input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
          <Label>Tipster</Label>
          <Input
            placeholder="Ime tipstera"
            value={tipster}
            onChange={(e) => setTipster(e.target.value)}
          />
          <Label>Utakmice i tipovi</Label>
          {matches.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Utakmica"
                value={item.match}
                onChange={(e) => {
                  const newMatches = [...matches];
                  newMatches[index].match = e.target.value;
                  setMatches(newMatches);
                }}
              />
              <Input
                placeholder="Tip"
                value={item.tip}
                onChange={(e) => {
                  const newMatches = [...matches];
                  newMatches[index].tip = e.target.value;
                  setMatches(newMatches);
                }}
              />
              <Input
                placeholder="Kvota"
                type="number"
                value={item.odd}
                onChange={(e) => {
                  const newMatches = [...matches];
                  newMatches[index].odd = e.target.value;
                  setMatches(newMatches);
                }}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <Button onClick={() => setMatches([...matches, { match: "", tip: "", odd: "" }])}>
              Dodaj par
            </Button>
            <Button onClick={calculate}>Izračunaj</Button>
          </div>
          <div>
            <p>Ukupna kvota: {totalOdds}</p>
            <p>Mogući dobitak: {potentialWin} unit</p>
            <p>Tip tiketa: {getTicketType(matches.length)}</p>
          </div>
          <Button onClick={addTicket}>Sačuvaj tiket</Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default TicketCalculator;

