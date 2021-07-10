import { PollHistory } from "../appTypes/appType";

export const dateToString = (date: Date) => new Date(date).toISOString();

export const getSectionList = (flatList: any[], sectionDivider: number) => {
  const sectionList = [];

  const listEnd = flatList.length % sectionDivider;
  const listParts = Math.floor(flatList.length / sectionDivider);

  for (let i = 0; i < listParts; i++) {
    let startIdx: number;
    let endIdx: number;

    if (i === 0) {
      startIdx = 0;
      endIdx = i + sectionDivider;
    } else {
      startIdx = i * sectionDivider;
      endIdx = startIdx + sectionDivider;
    }

    sectionList.push(flatList.slice(startIdx, endIdx));
  }

  listEnd > 0 && sectionList.push(flatList.slice(-listEnd));

  return sectionList;
};

export const getSortedListByDate = (dataList: any[]) => {
  return dataList.sort(
    (a, b) =>
      new Date(b.creationDate).valueOf() - new Date(a.creationDate).valueOf()
  );
};

export const getSortedListByChat = (dataList: any[]) => {
  const listWithChatMssg = dataList.map((item) => {
    if (item.chatMssgs) {
      return item;
    } else return { ...item, chatMssgs: [] };
  });

  const listWithChatSorted = listWithChatMssg.sort(
    (a, b) => b.chatMssgs?.length - a.chatMssgs?.length
  );

  return listWithChatSorted;
};
