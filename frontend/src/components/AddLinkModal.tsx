import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  addLink: (title: string, url: string) => void;
}

export default function AddLinkModal({
  isOpen,
  onClose,
  addLink,
}: AddLinkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <Input
            mt="1rem"
            placeholder="https://meishi.social"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            bgColor="main"
            color="white"
            mr={3}
            onClick={() => {
              addLink(title, url);
              setTitle('');
              setUrl('');
              onClose();
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
