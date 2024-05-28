/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: nimzu (https://sketchfab.com/nimzuk)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907
Title: Fox's islands
*/

import {useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {a} from '@react-spring/three' //& for using animation purpose 
import islandScene from '../assets/3d/island.glb'

// ^ implementing rotating of island
const Island = ({isRotating, setIsRotating, setCurrentStage,  ...props}) => {

    const islandRef = useRef();
    //^ Get access to the Three.js renderer and viewport
    const{gl, viewport} = useThree(); //^ hook
    const { nodes, materials } = useGLTF(islandScene);
    
    // ^ we have use ref to get last mouse posn
    const lastX = useRef(0);
     //^ Use a ref for rotation speed
    const rotationSpeed = useRef(0);
      // Define a damping factor to control rotation damping
    const dampingFactor = 0.95; //^ when we scroll it how fast does it move

    //^ when we press the mouse button down
    const handlePointerDown = (e) => {
      e.stopPropagation();
      e.preventDefault();
      setIsRotating(true);
      //^ to check wether what kind of click
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      lastX.current = clientX;//Store the current clientX position for reference
    };

    //^ when we release the mouse up
    const handlePointerUp = (e) => {
      e.stopPropagation();
      e.preventDefault();
      setIsRotating(false);
    };

    //^  Handle pointer (mouse or touch) move event
    const handlePointerMove = (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      //^ only when to happen if we are rotating
      if(isRotating){
         // If rotation is enabled, calculate the change in clientX position
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        //^ to change horizontal position
       const delta = (clientX - lastX.current) / viewport.width;

      //^ to update the island rotation based on the mouse 
      islandRef.current.rotation.y += delta * 0.01 * Math.PI; //& because its circle

      // ^ to update the reference for the last client
      lastX.current = clientX;

      //^ update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
      }
    }

    //^ handel event on key down
    const handelKeyDown=(e)=>{
      if(e.key === 'ArrowLeft'){
        if(!isRotating) setIsRotating(true);
        islandRef.current.rotation.y += 0.01 * Math.PI;
        rotationSpeed.current = 0.0125;
      }else if(e.key === 'ArrowRight'){
        if(!isRotating) setIsRotating(true);
        islandRef.current.rotation.y -= 0.01 * Math.PI;
        rotationSpeed.current = 0.0125;
      }
    }
    //^ handel event on key up
    const handelKeyUp=(e)=>{
      if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
        setIsRotating(false);
      }
    }

    //^ the way we're going to put all of these to action by using useFrame hook
    useFrame(()=>{
      if(!isRotating){
        rotationSpeed.current *= dampingFactor; //& we can apply damping factor that makes plane go smoother
        if(Math.abs(rotationSpeed.current)<0.01){ //& ccompletly stop the roation if seed is low
          rotationSpeed.current = 0;
        }
        //^ apply that slowing down of the plane as we scroll
        islandRef.current.rotation.y += rotationSpeed.current;
      }
      else{
        const rotation = islandRef.current.rotation.y;
        // ^github ccode below 
        /**
       * Normalize the rotation value to ensure it stays within the range [0, 2 * Math.PI].
       * The goal is to ensure that the rotation value remains within a specific range to
       * prevent potential issues with very large or negative rotation values.
       *  Here's a step-by-step explanation of what this code does:
       *  1. rotation % (2 * Math.PI) calculates the remainder of the rotation value when divided
       *     by 2 * Math.PI. This essentially wraps the rotation value around once it reaches a
       *     full circle (360 degrees) so that it stays within the range of 0 to 2 * Math.PI.
       *  2. (rotation % (2 * Math.PI)) + 2 * Math.PI adds 2 * Math.PI to the result from step 1.
       *     This is done to ensure that the value remains positive and within the range of
       *     0 to 2 * Math.PI even if it was negative after the modulo operation in step 1.
       *  3. Finally, ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) applies another
       *     modulo operation to the value obtained in step 2. This step guarantees that the value
       *     always stays within the range of 0 to 2 * Math.PI, which is equivalent to a full
       *     circle in radians.
       */
      const normalizedRotation =
      ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Set the current stage based on the island's orientation
    switch (true) {
      case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
        setCurrentStage(4);
        break;
      case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
        setCurrentStage(3);
        break;
      case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
        setCurrentStage(2);
        break;
      case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
        setCurrentStage(1);
        break;
      default:
        setCurrentStage(null);
    }
      }
    })

    //^ useEffect to add eventlistner
    useEffect(() => {
      //^ since we are touching the canvas(because we are wrapping everything inside of canvas)
      const canvas = gl.domElement;
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointerup", handlePointerUp)
      canvas.addEventListener("pointermove", handlePointerMove);
      document.addEventListener('keydown', handelKeyDown);
      document.addEventListener('keyup', handelKeyUp);

      return()=>{
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointerup", handlePointerUp)
        canvas.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener('keydown', handelKeyDown);
        document.removeEventListener('keyup', handelKeyUp);
      }
    }, [gl, handlePointerDown, handlePointerUp, handlePointerMove])
  return (
    // ^ warap all the elements of 3d folder a.group
    <a.group ref={islandRef} {...props} >
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
    </a.group>
  );
}



export default Island;