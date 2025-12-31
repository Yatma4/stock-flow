import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive';
}

const initialUsers: UserData[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@example.com', role: 'employee', status: 'active' },
  { id: '3', name: 'Pierre Bernard', email: 'pierre.bernard@example.com', role: 'employee', status: 'active' },
  { id: '4', name: 'Sophie Petit', email: 'sophie.petit@example.com', role: 'employee', status: 'inactive' },
];

export default function Users() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee' as 'admin' | 'employee',
    status: 'active' as 'active' | 'inactive',
  });

  const handleAdd = () => {
    setFormData({ name: '', email: '', role: 'employee', status: 'active' });
    setIsAddOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditOpen(true);
  };

  const handleDelete = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleRowClick = (user: UserData) => {
    handleEdit(user);
  };

  const submitAdd = () => {
    if (!formData.name || !formData.email) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    const newUser: UserData = {
      id: Date.now().toString(),
      ...formData,
    };
    setUsers([...users, newUser]);
    setIsAddOpen(false);
    toast.success(`Utilisateur "${formData.name}" ajouté avec succès`);
  };

  const submitEdit = () => {
    if (!selectedUser) return;
    if (!formData.name || !formData.email) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, ...formData } : u
    ));
    setIsEditOpen(false);
    toast.success(`Utilisateur "${formData.name}" modifié avec succès`);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsDeleteOpen(false);
    toast.success(`Utilisateur "${selectedUser.name}" supprimé`);
  };

  return (
    <MainLayout
      title="Gestion des utilisateurs"
      subtitle="Gérez les accès et permissions des utilisateurs"
    >
      <div className="space-y-6">
        {/* Role Info Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5 shadow-card border-l-4 border-l-primary">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Administrateur</h4>
                <p className="text-sm text-muted-foreground">
                  Accès complet à toutes les fonctionnalités
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5 shadow-card border-l-4 border-l-success">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <User className="h-6 w-6 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Employé</h4>
                <p className="text-sm text-muted-foreground">
                  Accès limité aux ventes uniquement
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button variant="gradient" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* Users Table */}
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="font-semibold">Utilisateur</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Rôle</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        user.role === 'admin'
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-success/10 text-success border-success/30'
                      )}
                    >
                      {user.role === 'admin' ? (
                        <Shield className="mr-1 h-3 w-3" />
                      ) : (
                        <User className="mr-1 h-3 w-3" />
                      )}
                      {user.role === 'admin' ? 'Administrateur' : 'Employé'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        user.status === 'active'
                          ? 'bg-success/10 text-success border-success/30'
                          : 'bg-muted text-muted-foreground border-muted'
                      )}
                    >
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(user);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte utilisateur avec les permissions appropriées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'employee') => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employé</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Annuler
            </Button>
            <Button variant="gradient" onClick={submitAdd}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations et permissions de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom complet</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'employee') => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employé</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Annuler
            </Button>
            <Button variant="gradient" onClick={submitEdit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedUser?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
