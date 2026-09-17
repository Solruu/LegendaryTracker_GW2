using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace GW2_NodeTracker
{
    /// <summary>
    /// Produit la texture du ruban de route.
    ///
    /// Une catégorie de trail sans attribut `texture` n'affiche rien dans
    /// Pathing : TacO fournit une texture par défaut, Blish HUD non. C'est
    /// pour ça que les routes restaient invisibles alors que les .trl étaient
    /// corrects.
    ///
    /// La texture est générée plutôt que livrée en binaire dans le dépôt :
    /// elle est blanche, et ce sont les attributs `color` des catégories qui
    /// la teintent (vert pour un chemin parcouru, rouge pour une ligne
    /// droite). Un seul fichier suffit donc pour les deux, et il n'y a aucun
    /// asset à maintenir.
    ///
    /// L'image est répétée sur la longueur du trail : l'alpha ne varie qu'en
    /// largeur (bords adoucis), jamais en longueur, ce qui garantit un
    /// raccord invisible d'une répétition à l'autre.
    /// </summary>
    public static class TrailTexture
    {
        public const string PackPath = "trails/trail.png";

        public static byte[] BuildPng(int size = 64)
        {
            using (var bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb))
            {
                for (int x = 0; x < size; x++)
                {
                    double u = (x + 0.5) / size;                     // 0..1 en travers du ruban
                    double edge = 1.0 - Math.Abs(u - 0.5) * 2.0;     // 1 au centre, 0 aux bords
                    if (edge < 0) edge = 0;

                    // Exposant < 1 : le ruban reste franc sur la majeure partie
                    // de sa largeur et ne s'adoucit que près des bords.
                    double a = Math.Pow(edge, 0.55) * 1.15;
                    if (a > 1.0) a = 1.0;

                    var color = Color.FromArgb((int)Math.Round(a * 255.0), 255, 255, 255);
                    for (int y = 0; y < size; y++)
                        bmp.SetPixel(x, y, color);
                }

                using (var ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Png);
                    return ms.ToArray();
                }
            }
        }
    }
}
