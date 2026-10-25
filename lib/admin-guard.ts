import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dashboardPathForRole, getSession } from "@/lib/session";

/** À appeler en tête d'une page admin : renvoie l'administrateur connecté, sinon redirige. */
export async function requireAdmin(): Promise<{ id: bigint; firstName: string }> {
  const session = await getSession();
  if (!session || !/^\d+$/.test(session.uid)) {
    redirect("/connexion?espace=admin");
  }

  const id = BigInt(session.uid);
  const admin = await prisma.user.findUnique({
    where: { id },
    select: { firstName: true, role: true, isActive: true },
  });

  if (!admin || !admin.isActive) {
    redirect("/connexion?espace=admin");
  }
  if (String(admin.role) !== "ADMIN") {
    redirect(dashboardPathForRole(String(admin.role)));
  }

  return { id, firstName: admin.firstName };
}