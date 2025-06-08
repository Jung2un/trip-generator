"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/modal";
import { Button } from "@heroui/button";

import { useChatStore } from '@/store/store';
import { useChatActions } from '@/hook/useChatActions';

export default function DeleteChatModal() {
  const { deleteModal, closeDeleteModal, sidebarOpen } = useChatStore();
  const { handleDeleteChat } = useChatActions();

  const handleConfirmDelete = () => {
    if (deleteModal.chatId) {
      handleDeleteChat(deleteModal.chatId);
      closeDeleteModal();
    }
  };

  return (
    <Modal
      isOpen={deleteModal.isOpen}
      onClose={closeDeleteModal}
      backdrop="opaque"
      placement="center"
      style={
        sidebarOpen ? { transform: "translateX(110px)" } : {}
      }
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        base: "bg-white dark:bg-zinc-800 rounded-xl tracking-[-0.01rem] shadow-2xl max-w-md w-full mx-4 ",
        header: "px-6 pt-6 text-xl font-semibold tracking-[0] text-gray-900 dark:text-white",
        body: "gap-1",
        footer: "px-6 pt-0 pb-6 flex justify-end gap-3 ",
        closeButton: "absolute top-2 right-2",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {deleteModal.chatTitle.length > 18
                ? `${deleteModal.chatTitle.slice(0, 18)}`
                : deleteModal.chatTitle
              }
            </ModalHeader>
            <ModalBody>
              <p>
                채팅을 삭제하시겠습니까?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                삭제된 채팅은 복구할 수 없습니다.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
              >
                취소
              </Button>
              <Button
                onPress={() => {
                  handleConfirmDelete();
                  onClose();
                }}
                className="bg-[#F44336] hover:bg-[#d32f2f]"
              >
                삭제
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
