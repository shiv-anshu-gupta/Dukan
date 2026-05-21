import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const pageWrap = "space-y-6 p-6";

const cardClass = "border-border bg-card shadow-sm";

const cardHeaderClass = "space-y-4";

const cardTitleClass = "text-xl";

const cardContentClass = "space-y-4";

const errorMessageClass = "rounded-xl border border-destructive/20 bg-destructive/10 text-destructive px-4 py-3";

const AdminProducts = () => {
  return (
    <div className={pageWrap}>
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle className={cardTitleClass}>Products</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

export default AdminProducts