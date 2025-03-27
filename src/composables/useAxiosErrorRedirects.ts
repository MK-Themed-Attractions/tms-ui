import { useRouter } from "vue-router";
export const useAxiosErrorRedirects = () => {
  const router = useRouter();

  async function redirectToLoginPage() {
    await router.replace({ name: "login" });
  }
  async function redirectToNotFoundPage() {
    await router.replace({ name: "notFound" });
  }

  return {
    redirectToLoginPage,
    redirectToNotFoundPage
  };
};
