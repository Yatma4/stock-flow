import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { products, sales, financialEntries, getDashboardStats } from '@/data/mockData';
import { useCategories } from '@/contexts/CategoryContext';
import { formatCurrency } from '@/lib/currency';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const reportTypes = [
  { id: 'sales', name: 'Rapport des ventes', description: 'Détail de toutes les ventes réalisées', icon: ShoppingCart, color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'financial', name: 'Situation financière', description: 'Bilan des revenus et dépenses', icon: DollarSign, color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'stock', name: 'État du stock', description: 'Inventaire complet des produits', icon: BarChart3, color: 'text-warning', bgColor: 'bg-warning/10' },
  { id: 'profit', name: 'Analyse des profits', description: 'Bénéfices par vente', icon: TrendingUp, color: 'text-chart-4', bgColor: 'bg-chart-4/10' },
];

const periods = [
  { id: 'daily', name: 'Quotidien', description: 'Rapport du jour' },
  { id: 'monthly', name: 'Mensuel', description: 'Rapport du mois' },
  { id: 'semester', name: 'Semestriel', description: 'Rapport sur 6 mois' },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isGenerating, setIsGenerating] = useState(false);
  const { categories } = useCategories();

  const generateReportContent = (type: string) => {
    const stats = getDashboardStats();
    const date = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    const periodName = periods.find(p => p.id === selectedPeriod)?.name || '';

    let content = `RAPPORT ${reportTypes.find(r => r.id === type)?.name.toUpperCase()}\n`;
    content += `Date: ${date}\nPériode: ${periodName}\n`;
    content += `${'='.repeat(50)}\n\n`;

    switch (type) {
      case 'sales':
        content += `VENTES\n${'-'.repeat(30)}\n`;
        sales.forEach(sale => {
          const product = products.find(p => p.id === sale.productId);
          content += `\n${product?.name}\n`;
          content += `  Quantité: ${sale.quantity}\n`;
          content += `  Prix unitaire: ${formatCurrency(sale.unitPrice)}\n`;
          content += `  Total: ${formatCurrency(sale.totalAmount)}\n`;
          content += `  Bénéfice: ${formatCurrency(sale.profit)}\n`;
        });
        content += `\n${'='.repeat(50)}\n`;
        content += `TOTAL VENTES: ${formatCurrency(stats.todaySales)}\n`;
        break;

      case 'financial':
        content += `REVENUS\n${'-'.repeat(30)}\n`;
        financialEntries.filter(e => e.type === 'income').forEach(e => {
          content += `${e.category}: ${formatCurrency(e.amount)} - ${e.description}\n`;
        });
        content += `\nDÉPENSES\n${'-'.repeat(30)}\n`;
        financialEntries.filter(e => e.type === 'expense').forEach(e => {
          content += `${e.category}: ${formatCurrency(e.amount)} - ${e.description}\n`;
        });
        content += `\n${'='.repeat(50)}\n`;
        content += `Revenus: ${formatCurrency(stats.totalRevenue)}\n`;
        content += `Dépenses: ${formatCurrency(stats.totalExpenses)}\n`;
        content += `Solde: ${formatCurrency(stats.netProfit)}\n`;
        break;

      case 'stock':
        content += `INVENTAIRE DES PRODUITS\n${'-'.repeat(30)}\n`;
        products.forEach(p => {
          const cat = categories.find(c => c.id === p.categoryId);
          content += `\n${p.name}\n`;
          content += `  Catégorie: ${cat?.name}\n`;
          content += `  Prix d'achat: ${formatCurrency(p.purchasePrice)}\n`;
          content += `  Quantité: ${p.quantity} ${p.unit}(s)\n`;
          content += `  Stock min: ${p.minStock}\n`;
          content += `  Statut: ${p.quantity === 0 ? 'RUPTURE' : p.quantity <= p.minStock ? 'FAIBLE' : 'OK'}\n`;
        });
        content += `\n${'='.repeat(50)}\n`;
        content += `Total produits: ${stats.totalProducts}\n`;
        content += `Valeur du stock: ${formatCurrency(stats.totalStockValue)}\n`;
        break;

      case 'profit':
        content += `ANALYSE DES BÉNÉFICES\n${'-'.repeat(30)}\n`;
        sales.forEach(sale => {
          const product = products.find(p => p.id === sale.productId);
          const margin = product ? ((sale.unitPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(1) : '0';
          content += `\n${product?.name}\n`;
          content += `  Prix d'achat: ${formatCurrency(product?.purchasePrice || 0)}\n`;
          content += `  Prix de vente: ${formatCurrency(sale.unitPrice)}\n`;
          content += `  Marge: ${margin}%\n`;
          content += `  Bénéfice: ${formatCurrency(sale.profit)}\n`;
        });
        const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
        content += `\n${'='.repeat(50)}\n`;
        content += `BÉNÉFICE TOTAL: ${formatCurrency(totalProfit)}\n`;
        break;
    }

    return content;
  };

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast.error('Veuillez sélectionner un type de rapport');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const content = generateReportContent(selectedReport);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${selectedReport}_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
    toast.success('Rapport téléchargé avec succès !');
  };

  return (
    <MainLayout title="Rapports et statistiques" subtitle="Génération de rapports détaillés">
      <div className="space-y-6">
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Période de rapport</h3>
              <p className="text-sm text-muted-foreground">Sélectionnez la période pour générer vos rapports</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {periods.map((period) => (
              <button key={period.id} onClick={() => setSelectedPeriod(period.id)}
                className={`flex flex-col items-start rounded-lg border p-4 text-left transition-all duration-200 ${selectedPeriod === period.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50 hover:bg-secondary/50'}`}>
                <span className="font-medium text-foreground">{period.name}</span>
                <span className="text-sm text-muted-foreground">{period.description}</span>
              </button>
            ))}
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Types de rapports</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {reportTypes.map((report) => (
              <Card key={report.id} className={`p-6 shadow-card cursor-pointer transition-all duration-200 ${selectedReport === report.id ? 'border-primary ring-1 ring-primary shadow-glow' : 'hover:shadow-card-hover'}`} onClick={() => setSelectedReport(report.id)}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${report.bgColor}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{report.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 transition-colors ${selectedReport === report.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                    {selectedReport === report.id && <div className="h-full w-full flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-primary-foreground" /></div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="p-6 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Générer le rapport</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedReport ? `${reportTypes.find((r) => r.id === selectedReport)?.name} - ${periods.find((p) => p.id === selectedPeriod)?.name}` : 'Sélectionnez un type de rapport'}
                </p>
              </div>
            </div>
            <Button variant="gradient" size="lg" disabled={!selectedReport || isGenerating} onClick={handleGenerateReport} className="w-full sm:w-auto">
              {isGenerating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Génération...</>) : (<><Download className="mr-2 h-4 w-4" />Télécharger</>)}
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
