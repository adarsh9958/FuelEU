import { useEffect, useState } from "react";
import type { AdjustedCBMember } from "../../../core/domain/types";
import { poolingService } from "../../infrastructure/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function PoolingTab() {
  const [year, setYear] = useState("2024");
  const [members, setMembers] = useState<AdjustedCBMember[]>([]);
  const [selected, setSelected] = useState<{ [shipId: string]: boolean }>({});
  const [result, setResult] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchAdjusted = async () => {
    try {
      const data = await poolingService.getAdjustedCB(year);
      setMembers(data);
      setSelected({});
      setResult(null);
    } catch (error: any) {
      alert(error?.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchAdjusted();
  }, [year]);

  const selectedMembers = members.filter((m) => selected[m.shipId]);

  const poolSum = poolingService.calculatePoolSum(selectedMembers);

  const isValidPool = poolingService.isValidPool(selectedMembers);

  const createPool = async () => {
    setIsCreating(true);
    try {
      const poolData = await poolingService.createPool(
        Number(year),
        selectedMembers
      );
      setResult(poolData);
      // Clear selections after successful pool creation
      setSelected({});
      alert("Pool created successfully!");
    } catch (error: any) {
      alert(error?.response?.data?.error || error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Pooling</CardTitle>
          <CardDescription>
            Create and manage compliance pools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {["2024", "2025"].map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchAdjusted}>Refresh</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Ship</TableHead>
                <TableHead>Adjusted CB (g)</TableHead>
                <TableHead>Adjusted CB (tonnes)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.shipId}>
                  <TableCell>
                    <Checkbox
                      checked={!!selected[m.shipId]}
                      onCheckedChange={(checked) =>
                        setSelected((s) => ({
                          ...s,
                          [m.shipId]: checked === true,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>{m.shipId}</TableCell>
                  <TableCell>{m.cb_before_g.toFixed(0)}</TableCell>
                  <TableCell>{(m.cb_before_g / 1e6).toFixed(3)} t</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pool Summary</CardTitle>
          <CardDescription>
            Select at least 2 ships with a non-negative total CB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <p>
              <b>Selected Ships:</b> {selectedMembers.length}
            </p>
            <p>
              <b>Pool Sum:</b> {(poolSum / 1e6).toFixed(3)} tCO₂e
            </p>
          </div>
          <Badge variant={poolSum >= 0 ? "default" : "destructive"}>
            {poolSum >= 0 ? "Valid pool (≥ 0)" : "Invalid pool (sum < 0)"}
          </Badge>
          {!isValidPool && selectedMembers.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedMembers.length < 2
                ? "⚠️ Select at least 2 ships to create a pool"
                : "⚠️ Total pool sum must be non-negative"}
            </p>
          )}
          <Button
            className="mt-4 w-full"
            disabled={!isValidPool || isCreating}
            onClick={createPool}
          >
            {isCreating ? "Creating Pool..." : "Create Pool"}
          </Button>
        </CardContent>
      </Card>
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Pool Result</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ship</TableHead>
                  <TableHead>Before (t)</TableHead>
                  <TableHead>After (t)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.members.map((m: any) => (
                  <TableRow key={m.shipId}>
                    <TableCell>{m.shipId}</TableCell>
                    <TableCell>{(m.cb_before / 1e6).toFixed(3)}</TableCell>
                    <TableCell>{(m.cb_after / 1e6).toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
