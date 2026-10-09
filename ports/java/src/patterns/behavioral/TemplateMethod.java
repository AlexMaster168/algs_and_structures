package patterns.behavioral;
import java.util.*;
import shared.Json;

public final class TemplateMethod {
    public record SalesRecord(String product,double amount) {}
    public record SalesReport(double total,String topProduct,int records) {}
    public abstract static class SalesDataMiner {
        public SalesReport mine(String raw){return report(parse(raw).stream().filter(this::isValid).toList());}
        protected abstract List<SalesRecord> parse(String raw);
        protected boolean isValid(SalesRecord r){return !r.product().isEmpty()&&Double.isFinite(r.amount())&&r.amount()>=0;}
        protected SalesReport report(List<SalesRecord> records){Map<String,Double> totals=new LinkedHashMap<>();double total=0;for(var r:records){total+=r.amount();totals.merge(r.product(),r.amount(),Double::sum);}String top=null;for(var e:totals.entrySet())if(top==null||e.getValue()>totals.get(top))top=e.getKey();return new SalesReport(total,top,records.size());}
    }
    public static class CsvSalesMiner extends SalesDataMiner {
        protected List<SalesRecord> parse(String raw){List<SalesRecord> records=new ArrayList<>();String[] lines=raw.trim().split("\n");for(int i=1;i<lines.length;i++){String[] cells=lines[i].split(",",-1);String amount=cells.length>1?cells[1].trim():"";double value;try{value=amount.isEmpty()?0:Double.parseDouble(amount);}catch(NumberFormatException e){value=Double.NaN;}records.add(new SalesRecord(cells[0].trim(),value));}return records;}
    }
    public static class JsonSalesMiner extends SalesDataMiner {
        protected List<SalesRecord> parse(String raw){List<SalesRecord> records=new ArrayList<>();for(Object item:(List<?>)Json.parse(raw)){Map<?,?> r=(Map<?,?>)item;records.add(new SalesRecord((String)r.get("product"),((Number)r.get("amount")).doubleValue()));}return records;}
    }
}
