/* eslint-disable prefer-arrow-callback */
import React, { useCallback, useEffect, useState } from 'react';
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
import { DragDropContext } from 'react-beautiful-dnd';
import StrictModeDroppable from '../components/StrictModeDroppable';
import httpClient from '../common/http-client';
import LinkList, { LinkType } from '../components/LinkList';
import AddLinkModal from '../components/AddLinkModal';
import ProfileBar from '../components/ProfileBar';

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState<any | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await httpClient.get('/users/profile');
      setProfile(data.profile);
      setUsername(data.username);
    };
    fetchProfile();
  }, []);

  const onDragEnd = useCallback(
    async (result: any) => {
      if (!result.destination) return;
      if (result.destination.index === result.source.index) return;

      const reordoredLinks = reorder(
        profile.links,
        result.source.index,
        result.destination.index
      );

      try {
        await httpClient.patch('/users/profile', {
          links: reordoredLinks,
        });
        setProfile({ ...profile, links: reordoredLinks });
        setIframeKey(iframeKey + 1);
      } catch (error) {
        setProfile({ ...profile, links: profile.links });
      }
    },
    [profile, iframeKey]
  );

  const addLink = async (title: string, url: string) => {
    const newLinks = [...profile.links];
    newLinks.unshift({
      title,
      url,
    });
    try {
      await httpClient.patch('/users/profile', { links: newLinks });
      setProfile({ ...profile, links: newLinks });
      setIframeKey(iframeKey + 1);
      onClose();
    } catch (error) {
      setProfile({ ...profile, links: profile.links });
      onClose();
    }
  };

  const deleteLink = async (url: string) => {
    try {
      const newLinks = profile.links.filter(
        (link: LinkType) => link.url !== url
      );
      await httpClient.patch('/users/profile', { links: newLinks });
      setProfile({ ...profile, links: newLinks });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      setProfile({ ...profile, links: profile.links });
    }
  };

  const updatePicture = async (picture: string) => {
    try {
      await httpClient.patch('/users/profile', { picture });
    } catch (error) {
      setProfile({ ...profile, picture: null });
    }
  };

  const deletePicture = async () => {
    try {
      await httpClient.patch('/users/profile', { picture: '' });
      setProfile({ ...profile, picture: null });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      setProfile({ ...profile, picture: null });
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
        setProfile({ ...profile, picture: e.target?.result as string });
        setIframeKey(iframeKey + 1);
        updatePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const updateTitle = async (title: string) => {
    try {
      await httpClient.patch('/users/profile', { title });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      setProfile({ ...profile, title: null });
      setIframeKey(iframeKey + 1);
    }
  };

  const updateBio = async (bio: string) => {
    try {
      await httpClient.patch('/users/profile', { bio });
      setIframeKey(iframeKey + 1);
    } catch (error) {
      setProfile({ ...profile, bio: null });
      setIframeKey(iframeKey + 1);
    }
  };

  if (!profile) return null;

  return (
    <>
      <Stack spacing={0}>
        <ProfileBar picture={profile.picture} username={username} />
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
                        name={profile.title}
                        bgColor="main"
                        src={profile.picture || undefined}
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
                          isDisabled={!profile.picture}
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
                        value={profile.title}
                        onChange={(event) => {
                          setProfile({ ...profile, title: event.target.value });
                        }}
                        onKeyDown={(event: any) => {
                          if (event.key === 'Enter') {
                            updateTitle(profile.title);
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
                        value={profile.bio}
                        onChange={(event) => {
                          setProfile({ ...profile, bio: event.target.value });
                        }}
                        onKeyDown={(event: any) => {
                          if (event.key === 'Enter') {
                            updateBio(profile.bio);
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
                      <LinkList links={profile.links} deleteLink={deleteLink} />
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
                src={`${username}`}
              />
            </Flex>
          </Show>
        </HStack>
      </Stack>
      <AddLinkModal isOpen={isOpen} onClose={onClose} addLink={addLink} />
    </>
  );
}
