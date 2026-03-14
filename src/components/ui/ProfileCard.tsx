import { Phone, MapPin, User as UserIcon } from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  mobile: string;
  village: string;
  photoUrl?: string;
}

export function ProfileCard({ name, mobile, village, photoUrl }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-100">
        {photoUrl ? (
          <Image src={photoUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
            <UserIcon className="w-7 h-7 text-indigo-400" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col min-w-0 justify-center">
        <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">{name}</h3>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Phone className="w-4 h-4 text-gray-400" />
            {mobile}
          </span>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1.5 whitespace-nowrap truncate">
            <MapPin className="w-4 h-4 text-gray-400" />
            {village}
          </span>
        </div>
      </div>
    </div>
  );
}
