import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { toAbsoluteUrl } from "@/utils/Assets";
import { Fragment } from "react";
import { Task } from "./Task";

const SortableItem = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : "none",
    transition,
    touchAction: "manipulation",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mb-2 w-full box-border max-w-[100%]"
    >
      <Task item={task} index={task.id} dropdown={true} />
    </div>
  );
};

const SortableColumn = ({ column }) => {
  const { setNodeRef, attributes, listeners } = useSortable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="border rounded-lg bg-gray-100 w-64 transition-all duration-200 min-w-[20%]"
      id={column.id}
    >
      <div className="flex items-center justify-between border-b rounded-t-lg w-full light:bg-white dark:bg-coal-600 py-2 px-3">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-900">{column.name}</p>
          <small className="text-xs">
            123 leads{" "}
            <span className="font-semibold text-success">&#8377;100/-</span>
          </small>
        </div>
        <button className="btn btn-sm btn-icon btn-light btn-clear">
          <i className="ki-filled ki-dots-horizontal"></i>
        </button>
      </div>
      <div className="min-h-[20px] p-3">
        {column.children.length > 0 ? (
          <SortableContext
            items={[column.id, ...column.children.map((task) => task.id)]}
            strategy={rectSortingStrategy}
          >
            {column.children.map((task) => (
              <SortableItem key={task.id} task={task} />
            ))}
          </SortableContext>
        ) : (
          <div className="p-4 flex flex-col items-center">
            {/* No data available */}
            <img
              src={toAbsoluteUrl(`/images/empty_icn.svg`)}
              className="dark:hidden max-h-[120px]"
              alt=""
            />
            <img
              src={toAbsoluteUrl(`/images/empty_icn_dark.svg`)}
              className="light:hidden max-h-[120px]"
              alt=""
            />
            <p className="text-sm text-gray-900 opacity-50 mt-3">
              No data available!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const DragAndDrop = ({ columns, setColumns, setDndActive }) => {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const findColumnByTaskId = (taskId) => {
    return columns.find((col) =>
      col.children.some((task) => task.id === taskId)
    );
  };

  const findColumnById = (id) => {
    return columns.find(
      (col) => col.id === id || col.children.some((task) => task.id === id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = columns
      .flatMap((col) => col.children)
      .find((task) => task.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeCol = findColumnByTaskId(active.id);
    if (!activeCol) return;

    const overCol = findColumnById(over.id);
    if (!overCol) return;

    const activeIndex = activeCol.children.findIndex((i) => i.id === active.id);
    const task = activeCol.children[activeIndex];

    // Handle intra-column reordering
    if (activeCol.id === overCol.id) {
      const overIndex = overCol.children.findIndex((i) => i.id === over.id);
      if (overIndex !== -1 && activeIndex !== overIndex) {
        const newChildren = arrayMove(
          activeCol.children,
          activeIndex,
          overIndex
        );
        const updatedCols = columns.map((col) =>
          col.id === activeCol.id ? { ...col, children: newChildren } : col
        );
        setColumns(updatedCols);
      }
      return;
    }

    // Handle inter-column dragging
    const newActiveChildren = [...activeCol.children];
    newActiveChildren.splice(activeIndex, 1);

    const newOverChildren = [...overCol.children, task];

    const updatedCols = columns.map((col) => {
      if (col.id === activeCol.id) {
        return { ...col, children: newActiveChildren };
      }
      if (col.id === overCol.id) {
        return { ...col, children: newOverChildren };
      }
      return col;
    });

    setColumns(updatedCols);
  };

  const handleDragEnd = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        handleDragStart(event);
        setDndActive(true);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setDndActive(false);
      }}
      onDragCancel={() => setDndActive(false)}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-4">
        {columns.map((column) => (
          <SortableColumn key={column.id} column={column} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div
            className="border rounded p-2 bg-gray-100"
            style={{
              width: "90%",
              transform: "none",
              opacity: 0.9,
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            <Task item={activeTask} index={0} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
