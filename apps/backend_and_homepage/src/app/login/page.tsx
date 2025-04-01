import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="scale-150 overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="flex flex-col gap-6 py-20">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Fitness App</h1>
                  <p className="text-muted-foreground text-balance">
                    An app for <strong className="italic">ADVANCED</strong>{" "}
                    sportsmen!
                  </p>
                </div>

                <div className="flex justify-center">
                  <Link
                    href="http://127.0.0.1:4000"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Check out!
                  </Link>
                </div>
              </div>
              <div className="bg-muted relative hidden md:block">
                <Image
                  src="/SportyPeople.png"
                  alt="Sports"
                  className="absolute inset-0 h-full w-full object-cover"
                  width={1000}
                  height={1000}
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            Image by Freepik
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
