import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";


type Props = {
    url: string;
}

const FilePreview = ({url}: Props) => {

  return <Link href={url} target="_blank" className="flex items-center gap-2">
    <Button variant="secondary" className="p-2">
        <ExternalLink className="w-4 h-4" />
        <span className="text-xs">View File</span>
    </Button>
  </Link>
};

export default FilePreview;