import { useRouter } from "vue-router";
export const useAxiosErrorRedirects = () => {
  const router = useRouter();

  async function redirectToLoginPage() {
    await router.replace({ name: "login" });
  }

  return {
    redirectToLoginPage,
  };
};
