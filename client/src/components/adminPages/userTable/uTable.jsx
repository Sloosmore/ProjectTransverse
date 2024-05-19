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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useAdmin } from "@/hooks/admin/adminContext";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const Utable = () => {
  const { users, setUsers, account } = useAdmin();
  const [stdLicenses, setStdLicenses] = useState();
  const [premLicenses, setPremLicenses] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setStdLicenses(
      users.reduce((prev, curr) => {
        curr.user_type === "Standard" ? (prev = prev + 1) : prev;
        return prev;
      }, 0)
    );
    setPremLicenses(
      users.reduce((prev, curr) => {
        console.log(prev);
        curr.user_type === "Premium" ? (prev = prev + 1) : prev;
        return prev;
      }, 0)
    );
  }, [users]);

  useEffect(() => console.log(premLicenses), [premLicenses]);

  const handleCheckboxChange = (index) => {
    setUsers((prev) =>
      prev.map((u, i) => (i === index ? { ...u, audio_on: !u.audio_on } : u))
    );
  };

  const handleTypeChange = (index, value) => {
    setUsers((prev) =>
      prev.map((u, i) => (i === index ? { ...u, user_type: value } : u))
    );
  };

  return (
    <div className="mt-10 flex flex-grow flex-col">
      <Input
        type="text"
        placeholder="Search by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[200px] sm:w-[350px]"
      />
      <Card className="mt-8 flex flex-grow ">
        <div className="overflow-auto flex grow">
          <Table className="p-3">
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-[100px]">Email</TableHead>
                <TableHead className="">Audio Recording</TableHead>
                <TableHead>License</TableHead>
                <TableHead className="text-right">Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {users
                .filter((user) =>
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user, index) => (
                  <TableRow key={index} className="border-0 h-[52px] ">
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.user_type !== "Admin" ? (
                        <div className="grid grid-cols-[20px,40px] items-center">
                          <Checkbox
                            checked={user.audio_on}
                            className="me-2"
                            onCheckedChange={(value) =>
                              handleCheckboxChange(index, value)
                            }
                          />
                          <p className="ms-2">{user.audio_on ? "On" : "Off"}</p>
                        </div>
                      ) : (
                        "NA"
                      )}
                    </TableCell>
                    <TableCell>
                      {user.user_type !== "Admin" ? (
                        <Select onValueChange={() => handleTypeChange(index)}>
                          <SelectTrigger className="sm:w-[180px]">
                            <SelectValue placeholder={user.user_type} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {account.standard_licenses - stdLicenses > 0 && (
                                <SelectItem value="Standard">
                                  Standard
                                </SelectItem>
                              )}
                              {account.premium_licenses - premLicenses > 0 && (
                                <SelectItem value="Premium">Premium</SelectItem>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
                        user.user_type
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      {new Date(user.date_created).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Utable;
