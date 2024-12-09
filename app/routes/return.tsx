export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    return json({ status });
};
