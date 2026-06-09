// REACT
import { memo, Suspense } from "react";
import { Outlet } from "react-router";
// MANTINE
import { em, Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
// COMPONENTS
import { Loader } from "@components/common/Loader/Loader.component";
import { Navbar } from "@components/common/Navbar/Navbar.component";

const Layout = memo(({ id }) => {
  // RESPONSIVE
  const isMobile = useMediaQuery(`(max-width: ${em(767)})`);

  return (
    <>
      <Flex
        bg="background"
        direction={"column"}
        mih={isMobile ? "100dvh" : "100vh"}
        w={"100%"}
      >
        <Flex
          direction={"column"}
          pos={"sticky"}
          style={{ zIndex: 1001 }}
          top={0}
          w={"100%"}
        >
          <Navbar />
        </Flex>
        <main className="grow">
          <Flex align={"center"} direction={"column"} gap={30}>
            <Suspense key={id} fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </Flex>
        </main>
      </Flex>
    </>
  );
});
export default Layout;
