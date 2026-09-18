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
    /// La texture est un CHEVRON, pas un ruban uni : c'est ce qui donne un
    /// sens de parcours à la route. Combinée à animSpeed, la chaîne de
    /// flèches défile dans le sens de la marche.
    ///
    /// Elle est générée plutôt que livrée en binaire, et blanche : ce sont
    /// les attributs `color` des catégories qui la teintent (gris minerai,
    /// brun bois, vert végétal, bleu pour les compositions mixtes, rouge
    /// pour le non-vérifié). Un seul fichier sert donc toutes les
    /// catégories.
    /// </summary>
    public static class TrailTexture
    {
        public const string PackPath = "trails/trail.png";

        /// <summary>
        /// Sens du chevron le long du ruban. Le signe de l'axe V d'un trail
        /// n'est pas documenté : si les flèches pointent à contresens en jeu,
        /// basculer ce booléen suffit, rien d'autre ne change.
        /// </summary>
        private const bool FlipArrows = false;

        private const double StrokeHalfWidth = 0.085; // demi-épaisseur du trait
        private const double Feather = 0.075;         // adoucissement des bords

        /// <summary>
        /// Chevron blanc sur fond transparent, tuilable dans la longueur.
        /// La pointe est au milieu de la tuile et les branches s'arrêtent
        /// avant les bords : les motifs s'enchaînent sans raccord visible et
        /// laissent un intervalle entre deux flèches.
        /// </summary>
        public static byte[] BuildPng(int size = 64)
        {
            using (var bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb))
            {
                for (int y = 0; y < size; y++)
                {
                    for (int x = 0; x < size; x++)
                    {
                        double u = (x + 0.5) / size;
                        double v = (y + 0.5) / size;
                        if (FlipArrows) v = 1.0 - v;

                        // Deux segments formant le chevron, pointe vers +V.
                        double d = Math.Min(
                            SegmentDistance(u, v, 0.04, 0.18, 0.50, 0.70),
                            SegmentDistance(u, v, 0.96, 0.18, 0.50, 0.70));

                        double a = 1.0 - (d - StrokeHalfWidth) / Feather;
                        if (a < 0) a = 0; else if (a > 1) a = 1;

                        bmp.SetPixel(x, y, Color.FromArgb((int)Math.Round(a * 255.0), 255, 255, 255));
                    }
                }

                using (var ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Png);
                    return ms.ToArray();
                }
            }
        }

        private static double SegmentDistance(double px, double py,
                                              double ax, double ay, double bx, double by)
        {
            double abx = bx - ax, aby = by - ay;
            double apx = px - ax, apy = py - ay;
            double len = abx * abx + aby * aby;

            double t = len < 1e-9 ? 0 : (apx * abx + apy * aby) / len;
            if (t < 0) t = 0; else if (t > 1) t = 1;

            double cx = ax + t * abx, cy = ay + t * aby;
            return Math.Sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
        }
    }
}
