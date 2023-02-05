/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import {
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';

export type LinkType = {
  title: string;
  url: string;
};

function LinkItem({
  link,
  index,
  deleteLink,
}: {
  link: LinkType;
  index: number;
  deleteLink: (url: string) => void;
}) {
  return (
    <Draggable draggableId={link.url} index={index}>
      {(provided) => (
        <Card
          w="36rem"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          my="2rem"
        >
          <CardBody>
            <Flex alignItems="center" justifyContent="space-between">
              <HStack spacing="1rem">
                <Flex alignItems="center">
                  <DragHandleIcon />
                </Flex>
                <Flex direction="column">
                  <Text fontWeight="bold">{link.title}</Text>
                  <Text fontWeight="bold">{link.url}</Text>
                </Flex>
              </HStack>
              <Flex>
                <IconButton
                  aria-label="Delete"
                  variant="ghost"
                  icon={<DeleteIcon />}
                  onClick={() => deleteLink(link.url)}
                />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      )}
    </Draggable>
  );
}

const LinkList = React.memo(({ links, deleteLink }: any) =>
  links.map((link: LinkType, index: number) => (
    <LinkItem
      key={link.url}
      link={link}
      index={index}
      deleteLink={deleteLink}
    />
  )));

export default LinkList;
