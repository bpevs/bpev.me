Item Model
=========


```ts
type coordinates = [ number, number ];
type tag = "string" | coordinates | Date;

interface Item = {
  content: any;
  tags: tag[];
  type: "MUSIC_ALBUM" | "PHOTO_ALBUM" | "PROJECT" | "STORY";
}
```
