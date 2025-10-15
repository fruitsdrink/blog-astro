type Props = {
  src: string;
}
export const JsFiddlePreview = ({ src }: Props) => {
  return (
    <div>
      <script async src={src}></script>
    </div>
  );
};