import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

type Props = {
    onChange: (urls: string[]) => void;
    type: 'image' | 'file';
}

const Uploader = ({type, onChange}: Props) => {
    return (
        <UploadDropzone endpoint={type} onClientUploadComplete={res => onChange(res.map(r => r.ufsUrl))} 
       onUploadError={error => { toast.error(error.message); return; }}
        />
    )
}

export default Uploader;