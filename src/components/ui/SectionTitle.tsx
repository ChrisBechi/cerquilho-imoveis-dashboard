import { Heading, Stack, Text, type BoxProps } from "@chakra-ui/react"

interface Props extends BoxProps {
  title: string
  description: string
}

export default function SectionTitle({ title, description, ...props }: Props) {
  return (
    <Stack spacing={5} mb={6} {...props}>
      <Heading size="lg">{title}</Heading>
      <Text color="textSecondary" fontSize="md" maxW="720px">
        {description}
      </Text>
    </Stack>
  )
}
