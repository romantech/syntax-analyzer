import { MouseEventHandler } from 'react';

type MouseEventKeys =
  | 'onClick' // 동일한 요소에서 마우스 버튼을 클릭할 때, 버블링 O
  | 'onMouseDown' // 마우스 버튼을 누를 때, 버블링 O
  | 'onMouseUp' // 마우스 버튼을 눌렀다 뗄 때, 버블링 O
  | 'onMouseEnter' // 마우스가 요소의 경계로 진입할 때, 버블링 X
  | 'onMouseLeave' // 마우스가 요소의 경계를 벗어날 때, 버블링 X
  | 'onMouseOver' // 요소 안에 들어올 때 (또는 그 안의 자식 요소로 들어올 때), 버블링 O
  | 'onMouseOut'; // 요소를 벗어날 때 (또는 그 안의 자식 요소를 벗어날 때), 버블링 O

export type MouseEventHandlers<T = HTMLElement> = {
  [key in MouseEventKeys]?: MouseEventHandler<T>;
};
