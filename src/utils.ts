import { Position, InternalNode, XYPosition } from "@xyflow/react";

// Вычисляет точку пересечения линии между центрами узлов и границей узла
function getEdgeParams(source: InternalNode, target: InternalNode) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

function getNodeIntersection(
  node: InternalNode,
  intersectionNode: InternalNode,
): XYPosition {
  const { width, height } = node.measured;
  const targetPosition = intersectionNode.internals.positionAbsolute;
  const sourcePosition = node.internals.positionAbsolute;

  const w = (width ?? 0) / 2;
  const h = (height ?? 0) / 2;

  const x2 = sourcePosition.x + w;
  const y2 = sourcePosition.y + h;
  const x1 = targetPosition.x + (intersectionNode.measured.width ?? 0) / 2;
  const y1 = targetPosition.y + (intersectionNode.measured.height ?? 0) / 2;

  const dx = x1 - x2;
  const dy = y1 - y2;

  const rad = Math.atan2(dy, dx);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return {
    x: x2 + w * cos,
    y: y2 + h * sin,
  };
}

function getEdgePosition(node: InternalNode, intersectionPoint: XYPosition) {
  const n = node.internals.positionAbsolute;
  const w = (node.measured.width ?? 0) / 2;
  const h = (node.measured.height ?? 0) / 2;

  if (
    Math.abs(intersectionPoint.x - (n.x + w)) >
    Math.abs(intersectionPoint.y - (n.y + h))
  ) {
    return intersectionPoint.x > n.x + w ? Position.Right : Position.Left;
  }
  return intersectionPoint.y > n.y + h ? Position.Bottom : Position.Top;
}

export { getEdgeParams };

