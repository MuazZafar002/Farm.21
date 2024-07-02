import { createContext} from 'react';

interface PostContextProps {
  title: string;
  body: string;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;
}

const PostContext = createContext<PostContextProps>({
  title: '',
  body: '',
  setTitle: () => {},
  setBody: () => {},
});

export {PostContext}
