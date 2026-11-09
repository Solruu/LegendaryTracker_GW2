using System;
namespace Blish_HUD {
  public class Logger {
    public static Logger GetLogger<T>() => new Logger();
    public static Logger GetLogger(Type t) => new Logger();
    public void Info(string f, params object[] a) {}
    public void Debug(string f, params object[] a) {}
    public void Warn(string f, params object[] a) {}
    public void Warn(Exception e, string f, params object[] a) {}
    public void Error(Exception e, string f, params object[] a) {}
  }
}
namespace Newtonsoft.Json {
  public enum Formatting { None, Indented }
  public enum NullValueHandling { Include, Ignore }
  [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
  public class JsonPropertyAttribute : Attribute {
    public string Name; public NullValueHandling NullValueHandling { get; set; }
    public JsonPropertyAttribute() {} public JsonPropertyAttribute(string n) { Name = n; }
  }
  public static class JsonConvert {
    static System.Text.Json.JsonSerializerOptions O = new System.Text.Json.JsonSerializerOptions {
      TypeInfoResolver = new System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver {
        Modifiers = { ti => { foreach (var p in ti.Properties) {
          var a = p.AttributeProvider?.GetCustomAttributes(typeof(JsonPropertyAttribute), true);
          if (a != null && a.Length > 0) { var j=(JsonPropertyAttribute)a[0]; if (j.Name!=null) p.Name = j.Name;
            if (j.NullValueHandling==NullValueHandling.Ignore) p.ShouldSerialize = (o,v) => v != null; }
        } } } } };
    public static string SerializeObject(object o, Formatting f = Formatting.None) => System.Text.Json.JsonSerializer.Serialize(o, o.GetType(), O);
    public static T DeserializeObject<T>(string s) => System.Text.Json.JsonSerializer.Deserialize<T>(s, O);
  }
}
