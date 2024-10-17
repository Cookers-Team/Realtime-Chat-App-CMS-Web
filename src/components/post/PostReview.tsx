import { useEffect } from "react";
import { SparklesIcon, StickyNoteIcon } from "lucide-react";
import { toast } from "react-toastify";
import useForm from "../../hooks/useForm";
import CustomModal from "../CustomModal";
import useFetch from "../../hooks/useFetch";
import InputField from "../InputField";
import SelectField from "../SelectField";

const PostReview = ({ isVisible, setVisible, postId, onButtonClick }: any) => {
  const { put, loading } = useFetch();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (form.status != 2 && form.status != 3)
      newErrors.status = "Trạng thái không được bỏ trống";
    if (form.status == 3 && !form.reason.trim())
      newErrors.reason = "Lý do không được bỏ trống";
    return newErrors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ status: "2", reason: "" }, {}, validate);

  useEffect(() => {
    if (postId) {
      setErrors({});
      setForm({ status: "2", reason: "" });
    }
  }, [isVisible, postId]);

  const handleUpdate = async () => {
    if (isValidForm()) {
      const res = await put(`/v1/post/change-state`, { id: postId, ...form });
      if (res.result) {
        toast.success("Xét duyệt bài đăng thành công");
        setVisible(false);
        onButtonClick();
      }
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      onClose={() => setVisible(false)}
      title="Xét duyệt bài đăng"
      bodyComponent={
        <>
          <SelectField
            title="Trạng thái"
            value={form.status}
            options={[
              { value: "2", name: "Chấp nhận" },
              { value: "3", name: "Từ chối" },
            ]}
            labelKey="name"
            valueKey="value"
            isRequire
            onChange={(value: any) => handleChange("status", value)}
            icon={SparklesIcon}
            error={errors.status}
          />
          {form.status == 3 && (
            <InputField
              title="Lý do từ chối"
              isRequire
              placeholder="Nhập lý do từ chối"
              value={form.reason}
              onChangeText={(value: any) => handleChange("reason", value)}
              icon={StickyNoteIcon}
              error={errors.reason}
            />
          )}
        </>
      }
      buttonText="GỬI"
      loading={loading}
      onButtonClick={handleUpdate}
    />
  );
};

export default PostReview;
