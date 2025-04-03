import Link from "next/link";
import Image from "next/image";

export default function NotVerifiedBanner() {
  return (
    <div className="bg-[#CDD7F0] py-2 px-4 rounded-lg w-full">
      <div className="container mx-auto flex items-center gap-2">
        <div className="flex items-center gap-2">
            <Image
              src="/verify.png"
              alt="verify"
              width={24}
              height={24}
              className="object-contain"
            />
          <span className="text-sm">
            Account not verified. Complete KYC to start transactions
          </span>
        </div>
        <Link href="#" className="text-sm text-blue-600 hover:underline">
          here
        </Link>
      </div>
    </div>
  );
}
