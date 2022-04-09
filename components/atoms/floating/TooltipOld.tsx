import clsx from "clsx";
import { memo, useEffect, useMemo, useState } from "react";
import { usePopper } from "react-popper";
import { useClickAway } from "react-use";
import styles from "./woTooltip.module.css";

function WoTooltip({children,content,hideOnClickAway,offset=[0,8],onClick,onMouseEnter, onMouseLeave,placement="auto",trigger=['click'],visible}) {
  const [show, setShow] = useState(visible);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const memoizedVisible = useMemo(() => show || visible, [show, visible])

  const popperInstance = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [{ name: 'arrow', options: { element: arrowElement } },
      {
            name: 'offset',
            options: {
              offset,
            },
      },
      { name: 'eventListeners', enabled: memoizedVisible }
    ],
  });

  // const [memoPopperInstance, setMemoPopperInstance] = useImmer(popperInstance);

  // useEffect(() => { setMemoPopperInstance(draft => ({ ...draft, ...popperInstance })) }, [popperInstance, setMemoPopperInstance])

  const { styles: popperStyles, attributes, update } = popperInstance;

  useEffect(() => {
    if (update) update();
  }, [show, update]);

  useClickAway(popperElement, () => {
    if (hideOnClickAway) setShow(false);
  });

  const handleMouseLeave = (event) => {
    if (trigger.includes('hover')) setShow(false);
    if (onMouseLeave) onMouseLeave(event);
  }

  const handleMouseEnter = (event) => {
    if (trigger.includes('hover')) setShow(true);
    if (onMouseEnter) onMouseEnter(event);
  }

  const handleClick = (event) => {
    if (trigger.includes('click')) setShow(true);
    if (onClick) onClick(event);
  }

  return (
    <div className={styles.root}>
      <div ref={setReferenceElement} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
      {children}
      </div>
      <div ref={setPopperElement} className={clsx(styles.tooltip, {[styles.isVisible]: visible || show})} style={popperStyles.popper} {...attributes.popper}>
        {content}
        <div ref={setArrowElement} className={styles.arrow} style={popperStyles.arrow} />
      </div>
    </div>
  );
}

WoTooltip.whyDidYouRender = true
export default memo(WoTooltip);
