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
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { DragDropContext } from 'react-beautiful-dnd';
import ProfileBar from '../components/ProfileBar';
import StrictModeDroppable from '../components/StrictModeDroppable';
import httpClient from '../common/http-client';
import LinkList, { LinkType } from '../components/LinkList';
import AddLinkModal from '../components/AddLinkModal';

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await httpClient.get('/users/profile');
      setProfile(data.profile);
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
      } catch (error) {
        setProfile({ ...profile, links: profile.links });
      }
    },
    [profile]
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
        updatePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const updateTitle = async (title: string) => {
    try {
      await httpClient.patch('/users/profile', { title });
    } catch (error) {
      setProfile({ ...profile, title: null });
    }
  };

  const updateBio = async (bio: string) => {
    try {
      await httpClient.patch('/users/profile', { bio });
    } catch (error) {
      setProfile({ ...profile, bio: null });
    }
  };

  if (!profile) return null;

  return (
    <>
      <Stack spacing={0}>
        <ProfileBar picture={profile.picture} />
        <HStack
          px={{ base: '3rem', lg: '16rem' }}
          justifyContent="space-between"
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
                          minW="25rem"
                          onClick={handleImageUpload}
                        >
                          Pick an image
                        </Button>
                        <Button
                          color="main"
                          minW="25rem"
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
          <Flex alignItems="center" h="100vh">
            <Box
              h="564px"
              w="274px"
              borderRadius="2xl"
              borderWidth="1rem"
              borderColor="#000"
            />
          </Flex>
        </HStack>
      </Stack>
      <AddLinkModal isOpen={isOpen} onClose={onClose} addLink={addLink} />
    </>
  );
}
