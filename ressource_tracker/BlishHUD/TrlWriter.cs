using System.Collections.Generic;
using System.IO;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Écrit le format binaire .trl de TacO, lu nativement par le module
    /// Pathing de Blish HUD.
    ///
    /// Structure, sans en-tête ni terminateur :
    ///   int32   version (0)
    ///   int32   map_id
    ///   puis, répété : float32 x, float32 y, float32 z
    ///
    /// L'ordre x/y/z est celui des attributs xpos/ypos/zpos des POI, donc
    /// exactement la convention déjà en place dans GatheredNode (y =
    /// altitude). Aucune conversion ici : si les POI tombent juste, les
    /// trails aussi.
    /// </summary>
    public static class TrlWriter
    {
        public static byte[] Build(int mapId, IList<RoutePoint> points)
        {
            using (var ms = new MemoryStream())
            using (var w = new BinaryWriter(ms))
            {
                w.Write(0);       // version
                w.Write(mapId);

                foreach (var p in points)
                {
                    w.Write((float)p.X);
                    w.Write((float)p.Y);
                    w.Write((float)p.Z);
                }

                w.Flush();
                return ms.ToArray();
            }
        }
    }
}
