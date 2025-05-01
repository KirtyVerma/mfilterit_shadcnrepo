import { toast } from "@/hooks/use-toast";


type ToastType = {
  description: string;
  title?: string;
  duration?: number;
};

export class Toast {
    static default(data: ToastType) {
      const { title, description, duration } = data;
      toast({
        title: title || "",
        description: description,
        duration: duration || 1500,
        className: "text-white bg-green-500 capitalize ",
      });
    }
    static success(data: ToastType) {
      const { title, description, duration } = data;
      toast({
        title: title || "success",
        description: description,
        duration: duration || 1500,
        className: "text-white bg-green-500 capitalize ",
      });
    }
    static error(data: ToastType) {
      const { title, description, duration } = data;
      toast({
        title: title || "error",
        description: description,
        duration: duration || 1500,
        className: "text-white bg-red-500 capitalize ",
      });
    }
  }