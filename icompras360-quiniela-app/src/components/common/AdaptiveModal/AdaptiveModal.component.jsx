// MANTINE
import { Drawer, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const AdaptiveModal = ({ children, ...props }) => {
  // RESPONSIVE
  const isMobile = useMediaQuery("(max-width: 768px)");

  // EARLY RETURN
  if (isMobile) {
    return (
      <Drawer position="bottom" {...props}>
        {children}
      </Drawer>
    );
  }

  return <Modal {...props}>{children}</Modal>;
};
