/* eslint-disable prefer-arrow-callback */
import React, { useCallback, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Show,
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext } from 'react-beautiful-dnd';
import StrictModeDroppable from '../components/StrictModeDroppable';
import httpClient from '../api/http-client';
import LinkList, { LinkType } from '../components/LinkList';
import AddLinkModal from '../components/AddLinkModal';
import ProfileBar from '../components/ProfileBar';
import { useAuth } from '../context/auth-context';

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function Profile() {
  const { user, updateUser, isLoaded } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [iframeKey, setIframeKey] = useState(0);

  const onDragEnd = useCallback(
    async (result: any) => {
      if (!result.destination) return;
      if (result.destination.index === result.source.index) return;

      const reordoredLinks = reorder(
        user.profile.links,
        result.source.index,
        result.destination.index
      );

      try {
        await httpClient.patch('/users/profile', {
          links: reordoredLinks,
        });
        updateUser({
          ...user,
          profile: { ...user.profile, links: reordoredLinks },
        });
        setIframeKey(iframeKey + 1);
      } catch (error) {
        updateUser({
          ...user,
          profile: { ...user.profile, links: user.profile.links },
        });
      }
    },
    [user, updateUser, iframeKey]
  );

  const addLink = async (title: string, url: string) => {
    const newLinks = [...user.profile.links];
    newLinks.unshift({
      id: uuidv4(),
      title,
      url,
    });
    try {
      await httpClient.patch('/users/profile', { links: newLinks });
      updateUser({ ...user, profile: { ...user.profile, links: newLinks } });
      setIframeKey(iframeKey + 1);
      onClose();
    } catch (error) {
      updateUser({
        ...user,
        profile: { ...user.profile, links: user.profile.links },
      });
      onClose();
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const newLinks = user.profile.links.filter(
        (link: LinkType) => link.id !== id
      );
      await httpClient.patch('/users/profile', { links: newLinks });
      updateUser({ ...user, profile: { ...user.profile, links: newLinks } });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      updateUser({
        ...user,
        profile: { ...user.profile, links: user.profile.links },
      });
    }
  };

  const updatePicture = async (picture: string) => {
    try {
      await httpClient.patch('/users/profile', { picture });
    } catch (error) {
      updateUser({ ...user, profile: { ...user.profile, picture: null } });
    }
  };

  const deletePicture = async () => {
    try {
      await httpClient.patch('/users/profile', { picture: '' });
      updateUser({ ...user, profile: { ...user.profile, picture: null } });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      // ignore
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = (event.target as HTMLInputElement).files![0];
      const reader = new FileReader();
      reader.onload = (e) => {
        updatePicture(
          (e.target?.result as string).replace(
            /^data:image\/[a-z]+;base64,/,
            ''
          )
        );
        setIframeKey(iframeKey + 1);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const updateTitle = async (title: string) => {
    try {
      await httpClient.patch('/users/profile', { title });
      updateUser({ ...user, profile: { ...user.profile, title } });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      updateUser({ ...user, profile: { ...user.profile, title: null } });
      setIframeKey(iframeKey + 1);
    }
  };

  const updateBio = async (bio: string) => {
    try {
      await httpClient.patch('/users/profile', { bio });
      updateUser({ ...user, profile: { ...user.profile, bio } });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      updateUser({ ...user, profile: { ...user.profile, bio: null } });
      setIframeKey(iframeKey + 1);
    }
  };

  if (!user || !isLoaded) return null;

  return (
    <>
      <Stack spacing={0}>
        <ProfileBar picture={user.profile.picture} username={user.username} />
        <HStack
          px={{ base: '3rem', lg: '16rem' }}
          justifyContent={{ base: 'center', lg: 'space-between' }}
          alignItems="start"
        >
          <Flex mt="10rem">
            <Stack>
              <Card mb="2rem">
                <CardBody>
                  <Flex direction="column" gap="1.5rem">
                    <HStack spacing="1rem">
                      <Avatar
                        size="xl"
                        name={user.profile.title}
                        bgColor="main"
                        src={
                          `data:image/jpeg;base64,${user.profile.picture}` ||
                          undefined
                        }
                      />
                      <Flex direction="column" gap="1rem">
                        <Button
                          color="white"
                          bgColor="main"
                          minW={{ base: '10rem', lg: '25rem' }}
                          onClick={handleImageUpload}
                        >
                          Pick an image
                        </Button>
                        <Button
                          color="main"
                          minW={{ base: '10rem', lg: '25rem' }}
                          isDisabled={!user.profile.picture}
                          onClick={deletePicture}
                        >
                          Remove
                        </Button>
                      </Flex>
                    </HStack>
                    <FormControl>
                      <FormLabel>Profile title</FormLabel>
                      <Input
                        placeholder="Profile title"
                        onBlur={onClose}
                        value={user.profile.title}
                        maxLength={50}
                        onChange={(event) => {
                          updateUser({
                            ...user,
                            profile: {
                              ...user.profile,
                              title: event.target.value,
                            },
                          });
                        }}
                        onKeyDown={(event: any) => {
                          if (event.key === 'Enter') {
                            updateTitle(user.profile.title);
                            event.target.blur();
                          }
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Bio</FormLabel>
                      <Textarea
                        placeholder="Bio"
                        onBlur={onClose}
                        value={user.profile.bio}
                        maxLength={80}
                        onChange={(event) => {
                          updateUser({
                            ...user,
                            profile: {
                              ...user.profile,
                              bio: event.target.value,
                            },
                          });
                        }}
                        onKeyDown={(event: any) => {
                          if (event.key === 'Enter') {
                            updateBio(user.profile.bio);
                            event.target.blur();
                          }
                        }}
                      />
                    </FormControl>
                  </Flex>
                </CardBody>
              </Card>
              <Button bgColor="main" color="white" onClick={onOpen}>
                Add link
              </Button>
              <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable droppableId="links">
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <LinkList
                        links={user.profile.links}
                        deleteLink={deleteLink}
                      />
                      {provided.placeholder}
                    </Box>
                  )}
                </StrictModeDroppable>
              </DragDropContext>
            </Stack>
          </Flex>
          <Show above="lg">
            <Flex alignItems="center" h="100vh">
              <iframe
                key={iframeKey}
                height="664px"
                width="348px"
                seamless
                scrolling="no"
                style={{
                  overflow: 'hidden',
                  borderRadius: '10px',
                  borderWidth: '1rem',
                  borderColor: '#000',
                }}
                title="Profile preview"
                src={`${user.username}`}
              />
            </Flex>
          </Show>
        </HStack>
      </Stack>
      <AddLinkModal isOpen={isOpen} onClose={onClose} addLink={addLink} />
    </>
  );
}
