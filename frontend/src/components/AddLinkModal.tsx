import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';

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
  const validateTitle = (value: string) => {
    let error;
    if (!value) {
      error = 'Title is required';
    }

    return error;
  };

  const validateUrl = (value: string) => {
    let error;
    if (!value) {
      error = 'URL is required';
    } else if (
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
        value
      ) === false
    ) {
      error = 'Invalid URL';
    }

    return error;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik
        initialValues={{
          title: '',
          url: '',
        }}
        onSubmit={(values) => {
          addLink(values.title, values.url);
          onClose();
        }}
      >
        {(props: any) => (
          <Form>
            <ModalContent>
              <ModalHeader>Add Link</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Field name="title" validate={validateTitle}>
                  {({ field, form }: any) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.title && form.touched.title}
                    >
                      <Input {...field} placeholder="Title" />
                      <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="url" validate={validateUrl}>
                  {({ field, form }: any) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.url && form.touched.url}
                    >
                      <Input
                        mt="1rem"
                        {...field}
                        placeholder="https://meishi.social"
                      />
                      <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={props.isSubmitting}
                  type="submit"
                  bgColor="main"
                  color="white"
                  mr={3}
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
