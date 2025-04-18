"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          {status === "authenticated" ? (
            <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Hoş Geldiniz, {session.user?.name || "Kullanıcı"}!
              </h1>
              <p className="text-gray-600">
                TinyPlot CMS kontrol panelinize erişim sağladınız. Dosyalarınızı
                yönetmeye başlayabilirsiniz.
              </p>
            </div>
          ) : (
            <h1 className="text-3xl font-bold mb-6">
              TinyPlot CMS'e Hoş Geldiniz
            </h1>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Dosyaları</CardTitle>
              <CardDescription>
                Yapay zeka konfigürasyon dosyalarınızı, araçlar, sorular ve
                sistem ayarları dahil olmak üzere yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Yapay zeka model konfigürasyonlarınızı, sistem komutlarını ve
                araç tanımlamalarını tek bir yerden düzenleyin.
              </p>
              <Link href="/files?tab=ai">
                <Button>AI Dosyalarını Yönet</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>i18n Dosyaları</CardTitle>
              <CardDescription>
                Uluslararasılaştırma ve yerelleştirme kaynaklarınızı yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Farklı diller için çeviri dosyalarını düzenleyin ve
                uygulamanızın uluslararasılaştırmasını güncel tutun.
              </p>
              <Link href="/files?tab=i18n">
                <Button>i18n Dosyalarını Yönet</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>TinyPlot CMS Hakkında</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Bu içerik yönetim sistemi, uygulamanızın yapılandırma
                dosyalarını yönetmek için basit bir arayüz sağlar. Dosyalarınızı
                güvenle değiştirmek için sözdizimi vurgulama özellikli Monaco
                kod düzenleyicisini kullanın.
              </p>
              {status !== "authenticated" && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Dosyaları yönetmek için giriş yapmanız gerekiyor.
                  </p>
                  <Link href="/login">
                    <Button variant="outline">Giriş Yap</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
