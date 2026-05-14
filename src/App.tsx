// import {
//   Background,
//   Controls,
//   Edge,
//   ReactFlow,
//   Node,
//   ConnectionMode,
//   MarkerType,
//   addEdge,
//   OnNodeDrag,
//   OnNodesChange,
//   applyNodeChanges,
//   Connection,
//   reconnectEdge,
//   useEdgesState,
//   useNodesState,
// } from "@xyflow/react";
// import { Test } from "./components/Test";
// import { SkillNode } from "./components/SkillNode";
// import { useCallback, useRef, useState } from "react";
// import "@xyflow/react/dist/style.css";
// // import Flow from "./components/b";

// const initialEdges:any[] = [
//   // { id: "e1-2", source: "1", target: "2", label: "reconnectable edge" },
// ];

// // const connectionLineStyle = {
// //   stroke: '#b1b1b7',
// // };

// // // const nodeTypes = {
// // //   custom: CustomNode,
// // // };

// // const edgeTypes = {
// //   floating: FloatingEdge,
// // };

// // const defaultEdgeOptions = {
// //   type: 'floating',
// //   markerEnd: {
// //     type: MarkerType.ArrowClosed,
// //     color: '#b1b1b7',
// //   },
// // };

// export default function App() {
//   // const [nodes, setNodes] = useState(initialNodes);
//   // const [edges, setEdges] = useState<Edge[]>([]);
//   // const onConnect = useCallback(
//   //   (params: any) =>
//   //     setEdges((eds) =>
//   //       addEdge(
//   //         {
//   //           ...params,
//   //           type: "floating",
//   //           // ConnectionMode: ConnectionMode.Loose
//   //           // markerEnd: { type: MarkerType.ArrowClosed },
//   //         },
//   //         eds,
//   //       ),
//   //     ),
//   //   [setEdges],
//   // );
//   const edgeReconnectSuccessful = useRef(true);
//   const [nodes, , onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const onConnect = useCallback(
//     (params: any) => setEdges((els) => addEdge(params, els)),
//     [],
//   );

//   const onReconnectStart = useCallback(() => {
//     edgeReconnectSuccessful.current = false;
//   }, []);

//   const onReconnect = useCallback((oldEdge: any, newConnection: Connection) => {
//     edgeReconnectSuccessful.current = true;
//     setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
//   }, []);

//   const onReconnectEnd = useCallback((_: any, edge: { id: string }) => {
//     if (!edgeReconnectSuccessful.current) {
//       setEdges((eds) => eds.filter((e) => e.id !== edge.id));
//     }

//     edgeReconnectSuccessful.current = true;
//   }, []);

//   const onNodeDrag: OnNodeDrag<SkillNode> = useCallback((_, node) => {
//     if (node.type === "skillNode") {
//       // From here on, Typescript knows that node.data
//       // is of type { num: number }
//       console.log("drag event", node.data.number);
//     }
//   }, []);

//   // const onNodesChange: OnNodesChange<SkillNode> = useCallback(
//   //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
//   //   [setNodes],
//   // );

//   return (
//     // Flow()
//     <div style={{ height: "100%", width: "100%" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         snapToGrid
//         onReconnect={onReconnect}
//         onReconnectStart={onReconnectStart}
//         onReconnectEnd={onReconnectEnd}
//         onConnect={onConnect}
//         fitView
//         attributionPosition="top-right"
//         // onDrag={onNodeDrag}
//         // onEdgesChange={onEdgesChange}
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//     // <Test/>
//   );
// }

import "@xyflow/react/dist/style.css";
import { SkillPage } from "./components/SkillPage";
import { SkillTreePage } from "./components/SkillTreePage";

// import { SkillTree } from "./components/SkillTree";

export default function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // display: "flex",
        // flexDirection: "row",
        // justifyContent: "space-around",
      }}
    >
      {/* <aside style={{ width: "10%", background: "#000"}}>
        dfsdf
      </aside> */}
      {/* <SkillPage/> */}
      <SkillTreePage />
    </div>
  );
}
