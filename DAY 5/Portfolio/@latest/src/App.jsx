import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // Navigation active link tracker
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Typing effect hooks
  const roles = ['Full Stack Developer', 'B.Tech CSE Student', 'DSA Enthusiast', 'Problem Solver']
  const [roleIndex, setRoleIndex] = useState(0)
  const [roleText, setRoleText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  useEffect(() => {
    let timer
    const handleTyping = () => {
      const currentRole = roles[roleIndex]
      if (!isDeleting) {
        setRoleText(currentRole.substring(0, roleText.length + 1))
        setTypingSpeed(100)

        if (roleText === currentRole) {
          timer = setTimeout(() => setIsDeleting(true), 1500)
          return
        }
      } else {
        setRoleText(currentRole.substring(0, roleText.length - 1))
        setTypingSpeed(50)

        if (roleText === '') {
          setIsDeleting(false)
          setRoleIndex((prev) => (prev + 1) % roles.length)
        }
      }
    }

    timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [roleText, isDeleting, roleIndex])

  // Scroll active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'dsa-lab', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const top = element.offsetTop
          const height = element.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // About tab control
  const [aboutTab, setAboutTab] = useState('education')

  // Skills dashboard filter and list
  const [skillCategory, setSkillCategory] = useState('all')
  const skillsData = [
    { name: 'C Language', level: 85, category: 'languages' },
    { name: 'Java', level: 80, category: 'languages' },
    { name: 'Python', level: 90, category: 'languages' },
    { name: 'Data Structures & Algorithms', level: 92, category: 'core' },
    { name: 'ReactJS', level: 85, category: 'frontend' },
    { name: 'NodeJS & Express', level: 80, category: 'backend' },
    { name: 'MongoDB', level: 75, category: 'databases' },
    { name: 'MySQL', level: 80, category: 'databases' },
  ]

  const filteredSkills = skillCategory === 'all' 
    ? skillsData 
    : skillsData.filter(s => s.category === skillCategory)


  // ==========================================
  // DSA LAB STATE MANAGEMENT
  // ==========================================
  const [dsaCategory, setDsaCategory] = useState('algorithms') // 'algorithms' | 'structures'
  
  // 1. ALGORITHMS SUB-SECTION STATE
  const [selectedAlg, setSelectedAlg] = useState('bubble')
  const INITIAL_ARRAY = [38, 27, 43, 8, 19, 56, 12, 48]
  const [sortArray, setSortArray] = useState([...INITIAL_ARRAY])
  const [sortSpeed, setSortSpeed] = useState(400) // ms delay
  const [frames, setFrames] = useState([])
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Visual tracking states driven by frames
  const [comparing, setComparing] = useState([])
  const [activeIndices, setActiveIndices] = useState([])
  const [sorted, setSorted] = useState([])
  const [visualStatus, setVisualStatus] = useState('Select an algorithm and click Start.')
  const [swapsCount, setSwapsCount] = useState(0)
  const [compsCount, setCompsCount] = useState(0)

  // Pre-generate sorting steps / frames
  const generateSortFrames = (alg, startArray) => {
    let arr = [...startArray]
    let n = arr.length
    let f = []
    let comps = 0
    let swaps = 0
    let sortedSet = new Set()

    // Helper to push frame snapshot
    const pushFrame = (arrayState, compPair, activeSet, sortedList, msg) => {
      f.push({
        array: [...arrayState],
        comparing: [...compPair],
        active: [...activeSet],
        sorted: [...sortedList],
        status: msg,
        comps,
        swaps
      })
    }

    if (alg === 'bubble') {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comps++
          pushFrame(arr, [j, j+1], [], Array.from(sortedSet), `Comparing index ${j} (${arr[j]}) and index ${j+1} (${arr[j+1]})`)
          if (arr[j] > arr[j+1]) {
            swaps++
            let temp = arr[j]
            arr[j] = arr[j+1]
            arr[j+1] = temp
            pushFrame(arr, [j, j+1], [], Array.from(sortedSet), `Swapping ${arr[j+1]} and ${arr[j]} since ${arr[j+1]} > ${arr[j]}`)
          }
        }
        sortedSet.add(n - i - 1)
        pushFrame(arr, [], [], Array.from(sortedSet), `Index ${n - i - 1} is now in its sorted position.`)
      }
    } 
    else if (alg === 'insertion') {
      for (let i = 1; i < n; i++) {
        let key = arr[i]
        let j = i - 1
        pushFrame(arr, [], [i], Array.from(sortedSet), `Select key ${key} from index ${i} to insert.`)
        
        while (j >= 0 && arr[j] > key) {
          comps++
          pushFrame(arr, [j, j+1], [i], Array.from(sortedSet), `Comparing key ${key} with ${arr[j]}`)
          arr[j+1] = arr[j]
          j = j - 1
          swaps++
          pushFrame(arr, [], [i], Array.from(sortedSet), `Shifted element ${arr[j+2]} to the right.`)
        }
        arr[j+1] = key
        pushFrame(arr, [], [j+1], Array.from(sortedSet), `Placed key ${key} at index ${j+1}.`)
      }
      pushFrame(arr, [], [], Array.from({length: n}, (_, idx) => idx), "Insertion sort complete!")
    } 
    else if (alg === 'selection') {
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i
        pushFrame(arr, [i], [minIdx], Array.from(sortedSet), `Scanning sub-array. Assume min is index ${i} (${arr[i]}).`)
        
        for (let j = i + 1; j < n; j++) {
          comps++
          pushFrame(arr, [j, minIdx], [minIdx], Array.from(sortedSet), `Comparing index ${j} (${arr[j]}) with current min (${arr[minIdx]})`)
          if (arr[j] < arr[minIdx]) {
            minIdx = j
            pushFrame(arr, [], [minIdx], Array.from(sortedSet), `New minimum found at index ${minIdx} (${arr[minIdx]})`)
          }
        }
        
        if (minIdx !== i) {
          swaps++
          let temp = arr[i]
          arr[i] = arr[minIdx]
          arr[minIdx] = temp
          pushFrame(arr, [i, minIdx], [], Array.from(sortedSet), `Swapping indices ${i} and ${minIdx}.`)
        }
        sortedSet.add(i)
        pushFrame(arr, [], [], Array.from(sortedSet), `Index ${i} is now in its sorted position.`)
      }
      sortedSet.add(n - 1)
      pushFrame(arr, [], [], Array.from({length: n}, (_, idx) => idx), "Selection sort complete!")
    } 
    else if (alg === 'quick') {
      const qSort = (low, high) => {
        if (low < high) {
          let pIdx = partition(low, high)
          qSort(low, pIdx - 1)
          qSort(pIdx + 1, high)
        } else if (low === high) {
          sortedSet.add(low)
          pushFrame(arr, [], [low], Array.from(sortedSet), `Single element sorted at index ${low}.`)
        }
      }
      const partition = (low, high) => {
        let pivot = arr[high]
        pushFrame(arr, [], [high], Array.from(sortedSet), `Picked pivot ${pivot} at index ${high}.`)
        let i = low - 1
        
        for (let j = low; j < high; j++) {
          comps++
          pushFrame(arr, [j, high], [high], Array.from(sortedSet), `Comparing element ${arr[j]} with pivot ${pivot}`)
          if (arr[j] < pivot) {
            i++
            swaps++
            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            pushFrame(arr, [i, j], [high], Array.from(sortedSet), `Swapped smaller element ${arr[i]} with ${arr[j]}.`)
          }
        }
        swaps++
        let temp = arr[i+1]
        arr[i+1] = arr[high]
        arr[high] = temp
        sortedSet.add(i+1)
        pushFrame(arr, [i+1, high], [], Array.from(sortedSet), `Placed pivot at index ${i+1}.`)
        return i + 1
      }
      qSort(0, n - 1)
      pushFrame(arr, [], [], Array.from({length: n}, (_, idx) => idx), "Quick sort complete!")
    } 
    else if (alg === 'merge') {
      const mSort = (l, r) => {
        if (l < r) {
          let m = Math.floor((l + r) / 2)
          pushFrame(arr, [], [l, r], Array.from(sortedSet), `Split sub-array from index ${l} to ${r}.`)
          mSort(l, m)
          mSort(m+1, r)
          merge(l, m, r)
        }
      }
      const merge = (l, m, r) => {
        let tempL = arr.slice(l, m+1)
        let tempR = arr.slice(m+1, r+1)
        let i = 0, j = 0, k = l
        
        pushFrame(arr, [], [l, r], Array.from(sortedSet), `Merging sub-arrays [${tempL.join(',')}] and [${tempR.join(',')}]`)
        
        while (i < tempL.length && j < tempR.length) {
          comps++
          pushFrame(arr, [l+i, m+1+j], [k], Array.from(sortedSet), `Comparing left ${tempL[i]} with right ${tempR[j]}`)
          if (tempL[i] <= tempR[j]) {
            arr[k] = tempL[i]
            i++
          } else {
            arr[k] = tempR[j]
            j++
          }
          swaps++
          pushFrame(arr, [], [k], Array.from(sortedSet), `Wrote ${arr[k]} back to index ${k}.`)
          k++
        }
        while (i < tempL.length) {
          arr[k] = tempL[i]
          pushFrame(arr, [], [k], Array.from(sortedSet), `Wrote remaining left element ${tempL[i]} to index ${k}.`)
          i++
          k++
        }
        while (j < tempR.length) {
          arr[k] = tempR[j]
          pushFrame(arr, [], [k], Array.from(sortedSet), `Wrote remaining right element ${tempR[j]} to index ${k}.`)
          j++
          k++
        }
      }
      mSort(0, n - 1)
      pushFrame(arr, [], [], Array.from({length: n}, (_, idx) => idx), "Merge sort complete!")
    } 
    else if (alg === 'heap') {
      const heapify = (size, idx) => {
        let largest = idx
        let l = 2 * idx + 1
        let r = 2 * idx + 2
        
        pushFrame(arr, [idx], [], Array.from(sortedSet), `Heapify subtree at node index ${idx}.`)
        
        if (l < size) {
          comps++
          if (arr[l] > arr[largest]) largest = l
        }
        if (r < size) {
          comps++
          if (arr[r] > arr[largest]) largest = r
        }
        if (largest !== idx) {
          swaps++
          let temp = arr[idx]
          arr[idx] = arr[largest]
          arr[largest] = temp
          pushFrame(arr, [idx, largest], [], Array.from(sortedSet), `Swapped element ${arr[idx]} and ${arr[largest]}.`)
          heapify(size, largest)
        }
      }
      // Build heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i)
      }
      // Extract nodes
      for (let i = n - 1; i > 0; i--) {
        swaps++
        let temp = arr[0]
        arr[0] = arr[i]
        arr[i] = temp
        sortedSet.add(i)
        pushFrame(arr, [0, i], [], Array.from(sortedSet), `Extract max ${temp} to sorted end.`)
        heapify(i, 0)
      }
      sortedSet.add(0)
      pushFrame(arr, [], [], Array.from({length: n}, (_, idx) => idx), "Heap sort complete!")
    }

    return f
  }

  // Effect to play back pre-generated frames declaratively
  useEffect(() => {
    if (!isPlaying) return
    if (currentFrameIdx >= frames.length - 1) {
      setIsPlaying(false)
      return
    }

    const timer = setTimeout(() => {
      const nextIdx = currentFrameIdx + 1
      setCurrentFrameIdx(nextIdx)
      
      const frame = frames[nextIdx]
      setSortArray(frame.array)
      setComparing(frame.comparing)
      setActiveIndices(frame.active)
      setSorted(frame.sorted)
      setVisualStatus(frame.status)
      setCompsCount(frame.comps)
      setSwapsCount(frame.swaps)
    }, sortSpeed)

    return () => clearTimeout(timer)
  }, [isPlaying, currentFrameIdx, frames, sortSpeed])

  const startPlayback = () => {
    if (frames.length === 0) {
      const generated = generateSortFrames(selectedAlg, sortArray)
      setFrames(generated)
      setCurrentFrameIdx(0)
      
      const first = generated[0]
      setSortArray(first.array)
      setComparing(first.comparing)
      setActiveIndices(first.active)
      setSorted(first.sorted)
      setVisualStatus(first.status)
      setCompsCount(first.comps)
      setSwapsCount(first.swaps)
    }
    setIsPlaying(true)
  }

  const pausePlayback = () => {
    setIsPlaying(false)
  }

  const stepPlayback = () => {
    if (isPlaying) return
    let generated = frames
    if (frames.length === 0) {
      generated = generateSortFrames(selectedAlg, sortArray)
      setFrames(generated)
      setCurrentFrameIdx(0)
    }

    if (currentFrameIdx < generated.length - 1) {
      const nextIdx = currentFrameIdx + 1
      setCurrentFrameIdx(nextIdx)
      
      const frame = generated[nextIdx]
      setSortArray(frame.array)
      setComparing(frame.comparing)
      setActiveIndices(frame.active)
      setSorted(frame.sorted)
      setVisualStatus(frame.status)
      setCompsCount(frame.comps)
      setSwapsCount(frame.swaps)
    }
  }

  const resetAlgorithms = () => {
    setIsPlaying(false)
    setSortArray([...INITIAL_ARRAY])
    setFrames([])
    setCurrentFrameIdx(0)
    setComparing([])
    setActiveIndices([])
    setSorted([])
    setVisualStatus('Visualizer reset to initial array. Press Start.')
    setSwapsCount(0)
    setCompsCount(0)
  }

  const generateRandomSortArray = () => {
    setIsPlaying(false)
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 55) + 5)
    setSortArray(newArr)
    setFrames([])
    setCurrentFrameIdx(0)
    setComparing([])
    setActiveIndices([])
    setSorted([])
    setVisualStatus('New random array generated. Press Start.')
    setSwapsCount(0)
    setCompsCount(0)
  }

  // 2. DATA STRUCTURES SUB-SECTION STATE
  const [activeStructure, setActiveStructure] = useState('stack') // 'stack' | 'queue' | 'linkedlist' | 'doublylist' | 'binarytree'
  const [structureInput, setStructureInput] = useState('')
  const [structureIndexInput, setStructureIndexInput] = useState('')
  const [structureLog, setStructureLog] = useState('Ready to execute operations.')

  // Stack State & operations
  const [stack, setStack] = useState([24, 78, 15])
  const pushStack = () => {
    const val = parseInt(structureInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (stack.length >= 6) {
      setStructureLog('Stack overflow: Maximum capacity (6 items) reached.')
      return
    }
    setStack([...stack, val])
    setStructureInput('')
    setStructureLog(`Pushed ${val} onto top of the stack.`)
  }
  const popStack = () => {
    if (stack.length === 0) {
      setStructureLog('Stack underflow: No items to pop.')
      return
    }
    const popped = stack[stack.length - 1]
    setStack(stack.slice(0, -1))
    setStructureLog(`Popped ${popped} off from the top.`)
  }

  // Queue State & operations
  const [queue, setQueue] = useState([10, 48, 92])
  const enqueue = () => {
    const val = parseInt(structureInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (queue.length >= 6) {
      setStructureLog('Queue overflow: Maximum capacity (6 items) reached.')
      return
    }
    setQueue([...queue, val])
    setStructureInput('')
    setStructureLog(`Enqueued ${val} at the rear.`)
  }
  const dequeue = () => {
    if (queue.length === 0) {
      setStructureLog('Queue underflow: No items to dequeue.')
      return
    }
    const popped = queue[0]
    setQueue(queue.slice(1))
    setStructureLog(`Dequeued ${popped} from the front.`)
  }

  // Linked List State & operations (HTML5 Drag and Drop swap + auto-adjusting arrows)
  const [linkedList, setLinkedList] = useState([
    { id: 1, val: 56 },
    { id: 2, val: 12 },
    { id: 3, val: 89 },
    { id: 4, val: 34 }
  ])
  const [draggedNodeIdx, setDraggedNodeIdx] = useState(null)
  const [dragOverNodeIdx, setDragOverNodeIdx] = useState(null)

  const insertHeadLL = () => {
    const val = parseInt(structureInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (linkedList.length >= 6) {
      setStructureLog('List limit: Keep list size <= 6 for display bounds.')
      return
    }
    const newNode = { id: Date.now(), val }
    setLinkedList([newNode, ...linkedList])
    setStructureInput('')
    setStructureLog(`Inserted node ${val} at the HEAD.`)
  }
  const insertTailLL = () => {
    const val = parseInt(structureInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (linkedList.length >= 6) {
      setStructureLog('List limit: Keep list size <= 6 for display bounds.')
      return
    }
    const newNode = { id: Date.now(), val }
    setLinkedList([...linkedList, newNode])
    setStructureInput('')
    setStructureLog(`Inserted node ${val} at the TAIL.`)
  }
  const insertAtIndexLL = () => {
    const val = parseInt(structureInput)
    const idx = parseInt(structureIndexInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (isNaN(idx) || idx < 0 || idx > linkedList.length) {
      setStructureLog(`Error: Input a valid index between 0 and ${linkedList.length}.`)
      return
    }
    if (linkedList.length >= 6) {
      setStructureLog('List limit: Keep list size <= 6 for display bounds.')
      return
    }
    const newNode = { id: Date.now(), val }
    const newList = [...linkedList]
    newList.splice(idx, 0, newNode)
    setLinkedList(newList)
    setStructureInput('')
    setStructureIndexInput('')
    setStructureLog(`Inserted node ${val} at index ${idx}.`)
  }
  const deleteHeadLL = () => {
    if (linkedList.length === 0) {
      setStructureLog('Linked list empty.')
      return
    }
    const val = linkedList[0].val
    setLinkedList(linkedList.slice(1))
    setStructureLog(`Deleted head node containing ${val}.`)
  }
  const deleteTailLL = () => {
    if (linkedList.length === 0) {
      setStructureLog('Linked list empty.')
      return
    }
    const val = linkedList[linkedList.length - 1].val
    setLinkedList(linkedList.slice(0, -1))
    setStructureLog(`Deleted tail node containing ${val}.`)
  }
  const deleteAtIndexLL = () => {
    const idx = parseInt(structureIndexInput)
    if (isNaN(idx) || idx < 0 || idx >= linkedList.length) {
      setStructureLog(`Error: Input a valid index between 0 and ${linkedList.length - 1}.`)
      return
    }
    const val = linkedList[idx].val
    const newList = [...linkedList]
    newList.splice(idx, 1)
    setLinkedList(newList)
    setStructureIndexInput('')
    setStructureLog(`Deleted node at index ${idx} containing ${val}.`)
  }

  // Drag and drop event handlers
  const handleDragStart = (e, index) => {
    setDraggedNodeIdx(index)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (dragOverNodeIdx !== index) {
      setDragOverNodeIdx(index)
    }
  }
  const handleDragEnd = () => {
    setDraggedNodeIdx(null)
    setDragOverNodeIdx(null)
  }
  const handleDrop = (e, targetIdx) => {
    e.preventDefault()
    if (draggedNodeIdx === null || draggedNodeIdx === targetIdx) return
    
    const newList = [...linkedList]
    const temp = newList[draggedNodeIdx]
    newList[draggedNodeIdx] = newList[targetIdx]
    newList[targetIdx] = temp
    
    setLinkedList(newList)
    setStructureLog(`Swapped node values: element [${temp.val}] and [${newList[draggedNodeIdx].val}] swapped places. Connecting arrows re-aligned.`)
    setDraggedNodeIdx(null)
    setDragOverNodeIdx(null)
  }

  // Doubly Linked List State & operations
  const [doublyList, setDoublyList] = useState([
    { id: 101, val: 33 },
    { id: 102, val: 77 },
    { id: 103, val: 22 }
  ])
  const [draggedDLLNodeIdx, setDraggedDLLNodeIdx] = useState(null)
  const [dragOverDLLNodeIdx, setDragOverDLLNodeIdx] = useState(null)

  const insertHeadDLL = () => {
    const val = parseInt(structureInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (doublyList.length >= 6) {
      setStructureLog('List limit: Keep list size <= 6 for display bounds.')
      return
    }
    const newNode = { id: Date.now(), val }
    setDoublyList([newNode, ...doublyList])
    setStructureInput('')
    setStructureLog(`Inserted node ${val} at the HEAD of Doubly Linked List.`)
  }
  const insertTailDLL = () => {
    const val = parseInt(structureInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (doublyList.length >= 6) {
      setStructureLog('List limit: Keep list size <= 6 for display bounds.')
      return
    }
    const newNode = { id: Date.now(), val }
    setDoublyList([...doublyList, newNode])
    setStructureInput('')
    setStructureLog(`Inserted node ${val} at the TAIL of Doubly Linked List.`)
  }
  const insertAtIndexDLL = () => {
    const val = parseInt(structureInput)
    const idx = parseInt(structureIndexInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (isNaN(idx) || idx < 0 || idx > doublyList.length) {
      setStructureLog(`Error: Input a valid index between 0 and ${doublyList.length}.`)
      return
    }
    if (doublyList.length >= 6) {
      setStructureLog('List limit: Keep list size <= 6 for display bounds.')
      return
    }
    const newNode = { id: Date.now(), val }
    const newList = [...doublyList]
    newList.splice(idx, 0, newNode)
    setDoublyList(newList)
    setStructureInput('')
    setStructureIndexInput('')
    setStructureLog(`Inserted node ${val} at index ${idx} of Doubly Linked List.`)
  }
  const deleteHeadDLL = () => {
    if (doublyList.length === 0) {
      setStructureLog('Doubly Linked List empty.')
      return
    }
    const val = doublyList[0].val
    setDoublyList(doublyList.slice(1))
    setStructureLog(`Deleted head node containing ${val} from Doubly Linked List.`)
  }
  const deleteTailDLL = () => {
    if (doublyList.length === 0) {
      setStructureLog('Doubly Linked List empty.')
      return
    }
    const val = doublyList[doublyList.length - 1].val
    setDoublyList(doublyList.slice(0, -1))
    setStructureLog(`Deleted tail node containing ${val} from Doubly Linked List.`)
  }
  const deleteAtIndexDLL = () => {
    const idx = parseInt(structureIndexInput)
    if (isNaN(idx) || idx < 0 || idx >= doublyList.length) {
      setStructureLog(`Error: Input a valid index between 0 and ${doublyList.length - 1}.`)
      return
    }
    const val = doublyList[idx].val
    const newList = [...doublyList]
    newList.splice(idx, 1)
    setDoublyList(newList)
    setStructureIndexInput('')
    setStructureLog(`Deleted node at index ${idx} containing ${val} from Doubly Linked List.`)
  }

  const handleDragStartDLL = (e, index) => {
    setDraggedDLLNodeIdx(index)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOverDLL = (e, index) => {
    e.preventDefault()
    if (dragOverDLLNodeIdx !== index) {
      setDragOverDLLNodeIdx(index)
    }
  }
  const handleDragEndDLL = () => {
    setDraggedDLLNodeIdx(null)
    setDragOverDLLNodeIdx(null)
  }
  const handleDropDLL = (e, targetIdx) => {
    e.preventDefault()
    if (draggedDLLNodeIdx === null || draggedDLLNodeIdx === targetIdx) return
    
    const newList = [...doublyList]
    const temp = newList[draggedDLLNodeIdx]
    newList[draggedDLLNodeIdx] = newList[targetIdx]
    newList[targetIdx] = temp
    
    setDoublyList(newList)
    setStructureLog(`Swapped doubly linked list elements: [${temp.val}] and [${newList[draggedDLLNodeIdx].val}] swapped places. Prev/Next references updated.`)
    setDraggedDLLNodeIdx(null)
    setDragOverDLLNodeIdx(null)
  }

  // BST State & traverse insert (supports up to 30 levels dynamically)
  const [bstNodes, setBstNodes] = useState({
    root: 50,
    rootL: 30,
    rootR: 70,
    rootLL: 15,
    rootLR: 40,
    rootRR: 85
  })
  const [bstHighlight, setBstHighlight] = useState([])
  const [bstRecent, setBstRecent] = useState(null)

  // Dynamic coordinate generator for binary tree nodes at any depth
  const getBstNodePos = (key) => {
    if (key === 'root') return { x: 50, y: 30 }
    let x = 50
    let span = 25
    const path = key.slice(4) // remove 'root'
    for (let char of path) {
      if (char === 'L') {
        x = x - span
      } else if (char === 'R') {
        x = x + span
      }
      span = span / 2
    }
    const depth = path.length
    const y = 30 + depth * 55 // 55px vertical gap per level
    return { x, y }
  }

  const insertBST = async () => {
    const val = parseInt(structureInput)
    if (isNaN(val)) {
      setStructureLog('Error: Input a valid number first.')
      return
    }
    if (val < 1 || val > 999) {
      setStructureLog('BST error: Enter a number between 1 and 999.')
      return
    }

    setStructureLog('Searching for insertion point in Binary Search Tree...')
    setBstHighlight([])
    setBstRecent(null)

    let path = []
    let insertSlot = ''

    if (!bstNodes.root) {
      path = ['root']
      insertSlot = 'root'
    } else {
      let current = 'root'
      path.push(current)

      while (current) {
        let curVal = bstNodes[current]
        if (val === curVal) {
          setStructureLog(`Value ${val} already exists in BST (no duplicates allowed).`)
          return
        }

        if (path.length >= 30) {
          setStructureLog('Traversal limit reached: 30 levels depth exceeded.')
          return
        }

        if (val < curVal) {
          let next = current + 'L'
          path.push(next)
          if (bstNodes[next] === null || bstNodes[next] === undefined) {
            insertSlot = next
            break
          }
          current = next
        } else {
          let next = current + 'R'
          path.push(next)
          if (bstNodes[next] === null || bstNodes[next] === undefined) {
            insertSlot = next
            break
          }
          current = next
        }
      }
    }

    // Step-by-step path traversal animation
    for (let i = 0; i < path.length; i++) {
      setBstHighlight(path.slice(0, i + 1))
      setStructureLog(`BST Search: Compare ${val} with node ${path[i]} (${bstNodes[path[i]] || 'Empty'}).`)
      const delay = path.length > 6 ? 250 : 450
      await new Promise(r => setTimeout(r, delay))
    }

    if (insertSlot) {
      setBstNodes(prev => ({ ...prev, [insertSlot]: val }))
      setBstRecent(insertSlot)
      setStructureInput('')
      setStructureLog(`Inserted ${val} successfully at level ${path.length - 1} (slot: ${insertSlot}).`)
    }
  }

  const clearBST = () => {
    setBstNodes({})
    setBstHighlight([])
    setBstRecent(null)
    setStructureLog('BST cleared. Ready to insert.')
  }

  // Traversal array calculation functions (In-Order, Pre-Order, Post-Order)
  const getBstTraversals = () => {
    if (!bstNodes.root) return { inOrder: [], preOrder: [], postOrder: [] }
    const inOrder = []
    const preOrder = []
    const postOrder = []
    const traverse = (key) => {
      if (bstNodes[key] === null || bstNodes[key] === undefined) return
      preOrder.push(bstNodes[key])
      traverse(key + 'L')
      inOrder.push(bstNodes[key])
      traverse(key + 'R')
      postOrder.push(bstNodes[key])
    }
    traverse('root')
    return { inOrder, preOrder, postOrder }
  }


  // ==========================================
  // CONTACT FORM STATE & VALIDATION
  // ==========================================
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    let tempErrors = {}
    if (!formData.name.trim()) tempErrors.name = 'Name is required'
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message cannot be empty'
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setFormSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    }
  }

  return (
    <>
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            M<span>S</span>_
          </a>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#skills" 
                className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="#dsa-lab" 
                className={`nav-link ${activeSection === 'dsa-lab' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                DSA Lab
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="section-container">
        <div className="hero-wrapper">
          <div className="hero-content">
            <span className="hero-tagline">Aspiring Full Stack Developer</span>
            <h1 className="hero-title">
              Hi, I am <br />
              <span>Mohammed Siddique</span>
            </h1>
            <div className="hero-typing">
              <span>{roleText}</span>
              <span className="cursor-blink"></span>
            </div>
            <p className="hero-desc">
              Currently pursuing my B.Tech in Computer Science & Engineering. Passionate about logic systems, building robust full-stack web architectures, and solving challenging algorithmic puzzles.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn-neon-filled">
                View My Projects
              </a>
              <a href="#contact" className="btn-neon">
                Let's Talk
              </a>
            </div>
          </div>

          <div className="hero-art-container">
            <div className="hero-svg-wrapper">
              <div className="hero-svg-bg"></div>
              {/* Premium Vector Avatar SVG */}
              <svg className="hero-avatar-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background base */}
                <circle cx="100" cy="100" r="95" fill="#0f172a" />
                <circle cx="100" cy="100" r="95" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4" className="svg-pulse" />
                
                {/* Tech Grid Background */}
                <path d="M40 100 H160 M100 40 V160" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="60" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" />
                <circle cx="100" cy="100" r="30" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" />
                
                {/* Floating Elements */}
                <text x="50" y="70" fill="rgba(6, 182, 212, 0.4)" fontSize="10" fontFamily="monospace" className="svg-float-1">01</text>
                <text x="140" y="80" fill="rgba(6, 182, 212, 0.4)" fontSize="10" fontFamily="monospace" className="svg-float-2">10</text>
                <text x="60" y="140" fill="rgba(6, 182, 212, 0.3)" fontSize="10" fontFamily="monospace" className="svg-float-2">&lt;/&gt;</text>
                <text x="130" y="130" fill="rgba(6, 182, 212, 0.3)" fontSize="10" fontFamily="monospace" className="svg-float-1">&#123; &#125;</text>

                {/* Developer Representation */}
                <path d="M50 170 C50 145 70 135 100 135 C130 135 150 145 150 170 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <path d="M95 135 V155 M105 135 V155" stroke="#06b6d4" strokeWidth="2" />
                <circle cx="95" cy="155" r="3" fill="#06b6d4" />
                <circle cx="105" cy="155" r="3" fill="#06b6d4" />
                
                {/* Neck */}
                <rect x="90" y="118" width="20" height="20" rx="3" fill="#fbcfe8" />
                
                {/* Face */}
                <circle cx="100" cy="95" r="28" fill="#fbcfe8" />
                
                {/* Hair */}
                <path d="M72 90 C70 75 80 65 100 65 C120 65 130 75 128 90 C125 78 115 72 100 72 C85 72 75 78 72 90 Z" fill="#1e1b4b" />
                
                {/* Glasses */}
                <rect x="82" y="88" width="14" height="10" rx="2" stroke="#0f172a" strokeWidth="2" fill="rgba(6, 182, 212, 0.15)" />
                <rect x="104" y="88" width="14" height="10" rx="2" stroke="#0f172a" strokeWidth="2" fill="rgba(6, 182, 212, 0.15)" />
                <path d="M96 93 H104" stroke="#0f172a" strokeWidth="2" />
                <path d="M78 93 H82 M118 93 H122" stroke="#0f172a" strokeWidth="1.5" />
                
                {/* Smile & Blush */}
                <path d="M95 108 C97 111 103 111 105 108" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                <circle cx="80" cy="100" r="3" fill="#f472b6" opacity="0.4" />
                <circle cx="120" cy="100" r="3" fill="#f472b6" opacity="0.4" />
                
                {/* Tech Halo */}
                <circle cx="100" cy="98" r="48" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 20" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-container">
        <span className="section-subtitle">01 . Background</span>
        <h2 className="section-title">About Me</h2>
        
        <div className="about-grid">
          <div className="about-card glass-panel">
            <h3>Hello World!</h3>
            <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
              I am a dedicated computer science student with a strong analytical mindset. I build software architectures using robust backends, and responsive modern user interfaces.
            </p>
            <p style={{ marginBottom: '16px', lineHeight: '1.7' }}>
              My academic career focuses on understanding structural design in programming, database optimization, and algorithm structures, aiming to translate real-world problems into efficient, scalable software products.
            </p>
            <p style={{ lineHeight: '1.7' }}>
              Currently looking for opportunities to expand my skill set and contribute to meaningful open source projects and enterprise software solutions.
            </p>
          </div>

          <div className="about-card glass-panel">
            <nav className="tab-nav">
              <button 
                className={`tab-btn ${aboutTab === 'education' ? 'active' : ''}`}
                onClick={() => setAboutTab('education')}
              >
                Education
              </button>
              <button 
                className={`tab-btn ${aboutTab === 'goals' ? 'active' : ''}`}
                onClick={() => setAboutTab('goals')}
              >
                Career Goals
              </button>
              <button 
                className={`tab-btn ${aboutTab === 'philosophy' ? 'active' : ''}`}
                onClick={() => setAboutTab('philosophy')}
              >
                Core Values
              </button>
            </nav>

            <div className="tab-content">
              {aboutTab === 'education' && (
                <div>
                  <div className="info-item">
                    <div className="info-title">Bachelor of Technology (B.Tech) in CSE</div>
                    <div className="info-date">Ongoing | Computer Science & Engineering</div>
                    <p style={{ marginTop: '6px' }}>Focusing on systems programming, algorithmic foundations, web applications, and database management systems.</p>
                  </div>
                  <div className="info-item" style={{ marginTop: '20px' }}>
                    <div className="info-title">Self-Directed Full Stack Specialization</div>
                    <div className="info-date">Ongoing</div>
                    <p style={{ marginTop: '6px' }}>Mastering NodeJS web servers, MERN architectures, relational schemas, and data structures.</p>
                  </div>
                </div>
              )}

              {aboutTab === 'goals' && (
                <div>
                  <div className="info-item">
                    <div className="info-title">Full Stack Web Architect</div>
                    <p style={{ marginTop: '6px' }}>Build software from custom database designs (SQL/NoSQL) through business logic controllers, up to smooth responsive frontend rendering.</p>
                  </div>
                  <div className="info-item" style={{ marginTop: '16px' }}>
                    <div className="info-title">Algorithm Engineering</div>
                    <p style={{ marginTop: '6px' }}>Leveraging strict data structures (DSA) to optimize system operations, manage load speeds, and decrease runtime complexities.</p>
                  </div>
                </div>
              )}

              {aboutTab === 'philosophy' && (
                <div>
                  <div className="info-item">
                    <div className="info-title">Code Cleanliness & Documentation</div>
                    <p style={{ marginTop: '6px' }}>Write readable, clean code adhering to SOLID principles. Keep comments meaningful and logic structures intuitive.</p>
                  </div>
                  <div className="info-item" style={{ marginTop: '16px' }}>
                    <div className="info-title">Continuous Adaptation</div>
                    <p style={{ marginTop: '6px' }}>Technology changes rapidly. I aim to learn new systems and languages continuously, adapting fast to project environments.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-container">
        <span className="section-subtitle">02 . Skill Set</span>
        <h2 className="section-title">My Tech Stack</h2>

        <div className="skills-tabs">
          <button 
            className={`skills-tab-btn ${skillCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSkillCategory('all')}
          >
            All Tech
          </button>
          <button 
            className={`skills-tab-btn ${skillCategory === 'languages' ? 'active' : ''}`}
            onClick={() => setSkillCategory('languages')}
          >
            Languages
          </button>
          <button 
            className={`skills-tab-btn ${skillCategory === 'frontend' ? 'active' : ''}`}
            onClick={() => setSkillCategory('frontend')}
          >
            Frontend
          </button>
          <button 
            className={`skills-tab-btn ${skillCategory === 'backend' ? 'active' : ''}`}
            onClick={() => setSkillCategory('backend')}
          >
            Backend
          </button>
          <button 
            className={`skills-tab-btn ${skillCategory === 'databases' ? 'active' : ''}`}
            onClick={() => setSkillCategory('databases')}
          >
            Databases
          </button>
          <button 
            className={`skills-tab-btn ${skillCategory === 'core' ? 'active' : ''}`}
            onClick={() => setSkillCategory('core')}
          >
            CS Core
          </button>
        </div>

        <div className="skills-grid">
          {filteredSkills.map((skill, index) => (
            <div key={index} className="skill-card glass-panel">
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar-bg">
                <div 
                  className="skill-bar-fill" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Expanded DSA Lab Section */}
      <section id="dsa-lab" className="section-container">
        <span className="section-subtitle">03 . Live Interactive Showcase</span>
        <h2 className="section-title">Data Structures & Algorithms Lab</h2>
        
        {/* Lab Navigation */}
        <div className="dsa-lab-tabs">
          <button 
            className={`dsa-lab-tab ${dsaCategory === 'algorithms' ? 'active' : ''}`}
            onClick={() => { setDsaCategory('algorithms'); setStructureLog('Algorithms Lab selected.'); }}
          >
            1. Algorithms
          </button>
          <button 
            className={`dsa-lab-tab ${dsaCategory === 'structures' ? 'active' : ''}`}
            onClick={() => { setDsaCategory('structures'); setStructureLog('Data Structures Lab selected.'); }}
          >
            2. Data Structures
          </button>
        </div>

        {/* --- Sub-section 1: ALGORITHMS --- */}
        {dsaCategory === 'algorithms' && (
          <div className="dsa-lab-wrapper">
            <div className="dsa-visualizer-container glass-panel">
              <div className="dsa-header-block">
                <div className="dsa-select-bar">
                  <div className="dsa-console-title">
                    <span style={{ color: '#06b6d4' }}>&gt;</span>
                  </div>
                </div>
                <div className="alg-pills">
                  {[
                    { key: 'bubble', label: 'Bubble Sort' },
                    { key: 'insertion', label: 'Insertion Sort' },
                    { key: 'selection', label: 'Selection Sort' },
                    { key: 'quick', label: 'Quick Sort' },
                    { key: 'merge', label: 'Merge Sort' },
                    { key: 'heap', label: 'Heap Sort' },
                  ].map(alg => (
                    <button
                      key={alg.key}
                      className={`alg-pill ${selectedAlg === alg.key ? 'active' : ''}`}
                      onClick={() => { setSelectedAlg(alg.key); resetAlgorithms(); }}
                      disabled={isPlaying}
                    >
                      {alg.label}
                    </button>
                  ))}
                </div>

                <div className="speed-control">
                  <span>Speed:</span>
                  <input 
                    type="range" 
                    min="100" 
                    max="1200" 
                    step="100" 
                    value={1300 - sortSpeed} 
                    onChange={(e) => setSortSpeed(1300 - parseInt(e.target.value))}
                    className="speed-slider"
                  />
                </div>

                <div className="dsa-controls">
                  <button 
                    className="btn-neon" 
                    onClick={generateRandomSortArray} 
                    disabled={isPlaying}
                  >
                    New Array
                  </button>
                  
                  {!isPlaying ? (
                    <button 
                      className="btn-neon-filled" 
                      onClick={startPlayback}
                    >
                      Start
                    </button>
                  ) : (
                    <button 
                      className="btn-neon-filled" 
                      onClick={pausePlayback}
                      style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#090d16' }}
                    >
                      Pause
                    </button>
                  )}

                  <button 
                    className="btn-neon" 
                    onClick={stepPlayback} 
                    disabled={isPlaying}
                  >
                    Step
                  </button>

                  <button 
                    className="btn-neon" 
                    onClick={resetAlgorithms}
                    style={{ color: '#ef4444', borderColor: '#ef4444' }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Visualizer Canvas */}
              <div className="visualizer-canvas">
                {sortArray.map((value, idx) => {
                  let barClass = 'visualizer-bar'
                  if (comparing.includes(idx)) barClass += ' comparing'
                  if (activeIndices.includes(idx)) barClass += ' active'
                  if (sorted.includes(idx)) barClass += ' sorted'

                  return (
                    <div 
                      key={idx} 
                      className={barClass} 
                      style={{ height: `${(value / 60) * 80 + 10}%` }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{value}</span>
                    </div>
                  )
                })}
              </div>

              {/* simulated compiler console log */}
              <div className="dsa-console-log">
                <span>Console: <strong style={{ color: '#fff' }}>{visualStatus}</strong></span>
                <div className="dsa-stats">
                  <span>Comparisons: <strong>{compsCount}</strong></span>
                  <span>Swaps/Writes: <strong>{swapsCount}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Sub-section 2: DATA STRUCTURES --- */}
        {dsaCategory === 'structures' && (
          <div className="dsa-lab-wrapper">
            <div className="structure-selector-bar">
              <button 
                className={`structure-btn ${activeStructure === 'stack' ? 'active' : ''}`}
                onClick={() => { setActiveStructure('stack'); setStructureInput(''); setStructureLog('Stack Workspace loaded.'); }}
              >
                Stack
              </button>
              <button 
                className={`structure-btn ${activeStructure === 'queue' ? 'active' : ''}`}
                onClick={() => { setActiveStructure('queue'); setStructureInput(''); setStructureLog('Queue Workspace loaded.'); }}
              >
                Queue
              </button>
              <button 
                className={`structure-btn ${activeStructure === 'linkedlist' ? 'active' : ''}`}
                onClick={() => { setActiveStructure('linkedlist'); setStructureInput(''); setStructureLog('Linked List Workspace loaded. Drag nodes to swap values! Arrows will auto-align.'); }}
              >
                Linked List
              </button>
              <button 
                className={`structure-btn ${activeStructure === 'binarytree' ? 'active' : ''}`}
                onClick={() => { setActiveStructure('binarytree'); setStructureInput(''); setStructureLog('Binary Search Tree Workspace loaded. Insert values between 1 and 99.'); }}
              >
                Binary Tree
              </button>
              <button 
                className={`structure-btn ${activeStructure === 'doublylist' ? 'active' : ''}`}
                onClick={() => { setActiveStructure('doublylist'); setStructureInput(''); setStructureIndexInput(''); setStructureLog('Doubly Linked List Workspace loaded. Drag nodes to swap values! Prev/Next pointers auto-align.'); }}
              >
                Doubly LL
              </button>
            </div>

            <div className="structure-workspace glass-panel">
              {/* Universal control bar for structures */}
              <div className="structure-controls">
                <input 
                  type="number" 
                  value={structureInput}
                  onChange={(e) => setStructureInput(e.target.value)}
                  placeholder="Val"
                  className="structure-input"
                />

                {activeStructure === 'stack' && (
                  <>
                    <button className="btn-neon-filled" onClick={pushStack}>Push</button>
                    <button className="btn-neon" onClick={popStack}>Pop</button>
                  </>
                )}

                {activeStructure === 'queue' && (
                  <>
                    <button className="btn-neon-filled" onClick={enqueue}>Enqueue</button>
                    <button className="btn-neon" onClick={dequeue}>Dequeue</button>
                  </>
                )}

                {activeStructure === 'linkedlist' && (
                  <>
                    <button className="btn-neon-filled" onClick={insertHeadLL}>Insert Head</button>
                    <button className="btn-neon" onClick={insertTailLL}>Insert Tail</button>
                    <input 
                      type="number" 
                      value={structureIndexInput}
                      onChange={(e) => setStructureIndexInput(e.target.value)}
                      placeholder="Idx"
                      className="structure-input"
                      style={{ width: '55px' }}
                    />
                    <button className="btn-neon" onClick={insertAtIndexLL}>Insert@Idx</button>
                    <button className="btn-neon" onClick={deleteAtIndexLL} style={{ color: '#ef4444', borderColor: '#ef4444' }}>Del@Idx</button>
                    <button className="btn-neon" onClick={deleteHeadLL} style={{ color: '#ef4444', borderColor: '#ef4444' }}>Del Head</button>
                    <button className="btn-neon" onClick={deleteTailLL} style={{ color: '#ef4444', borderColor: '#ef4444' }}>Del Tail</button>
                  </>
                )}

                {activeStructure === 'doublylist' && (
                  <>
                    <button className="btn-neon-filled" onClick={insertHeadDLL}>Insert Head</button>
                    <button className="btn-neon" onClick={insertTailDLL}>Insert Tail</button>
                    <input 
                      type="number" 
                      value={structureIndexInput}
                      onChange={(e) => setStructureIndexInput(e.target.value)}
                      placeholder="Idx"
                      className="structure-input"
                      style={{ width: '55px' }}
                    />
                    <button className="btn-neon" onClick={insertAtIndexDLL}>Insert@Idx</button>
                    <button className="btn-neon" onClick={deleteAtIndexDLL} style={{ color: '#ef4444', borderColor: '#ef4444' }}>Del@Idx</button>
                    <button className="btn-neon" onClick={deleteHeadDLL} style={{ color: '#ef4444', borderColor: '#ef4444' }}>Del Head</button>
                    <button className="btn-neon" onClick={deleteTailDLL} style={{ color: '#ef4444', borderColor: '#ef4444' }}>Del Tail</button>
                  </>
                )}

                {activeStructure === 'binarytree' && (
                  <>
                    <button className="btn-neon-filled" onClick={insertBST}>Insert Node</button>
                    <button className="btn-neon" onClick={clearBST} style={{ color: '#ef4444', borderColor: '#ef4444' }}>Clear Tree</button>
                  </>
                )}
              </div>

              {/* --- 1. STACK CANVAS --- */}
              {activeStructure === 'stack' && (
                <div className="stack-canvas">
                  <div className="stack-container">
                    {stack.map((item, idx) => (
                      <div key={idx} className="stack-element">
                        {idx === stack.length - 1 && (
                          <span className="stack-ptr">TOP</span>
                        )}
                        {item}
                      </div>
                    ))}
                    {stack.length === 0 && (
                      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '0.8rem', marginTop: 'auto', marginBottom: 'auto' }}>
                        Empty Stack
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- 2. QUEUE CANVAS --- */}
              {activeStructure === 'queue' && (
                <div className="queue-canvas">
                  <div className="queue-container">
                    {queue.map((item, idx) => (
                      <div key={idx} className="queue-element">
                        {idx === 0 && <span className="queue-ptr" style={{ top: '-20px' }}>FRONT (Exit)</span>}
                        {idx === queue.length - 1 && <span className="queue-ptr" style={{ bottom: '-20px', top: 'auto' }}>REAR (Enter)</span>}
                        {item}
                      </div>
                    ))}
                    {queue.length === 0 && (
                      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '0.8rem', width: '100%', textAlign: 'center' }}>
                        Empty Queue
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- 3. LINKED LIST CANVAS (DRAG AND DROP) --- */}
              {activeStructure === 'linkedlist' && (
                <div className="list-canvas">
                  <div className="list-container">
                    {linkedList.map((node, idx) => (
                      <div 
                        key={node.id} 
                        className={`list-node-wrapper ${dragOverNodeIdx === idx ? 'drag-over-prev' : ''}`}
                      >
                        <div 
                          className={`list-node-capsule ${draggedNodeIdx === idx ? 'dragging' : ''} ${dragOverNodeIdx === idx ? 'drag-over' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          onDrop={(e) => handleDrop(e, idx)}
                        >
                          <div className="node-val-sec">{node.val}</div>
                          <div className="node-ptr-sec">
                            <div className="pointer-dot"></div>
                          </div>
                        </div>

                        {idx < linkedList.length - 1 && (
                          <svg className="node-arrow-svg" viewBox="0 0 50 24">
                            <path 
                              className="arrow-path" 
                              d="M 0 12 L 42 12" 
                              markerEnd="url(#arrow)"
                            />
                            <polygon 
                              className="arrow-head" 
                              points="42,8 50,12 42,16"
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                    
                    {linkedList.length === 0 && (
                      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                        Empty Linked List
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- 4. DOUBLY LINKED LIST CANVAS --- */}
              {activeStructure === 'doublylist' && (
                <div className="list-canvas">
                  <div className="list-container">
                    {doublyList.map((node, idx) => (
                      <div 
                        key={node.id} 
                        className={`list-node-wrapper ${dragOverDLLNodeIdx === idx ? 'drag-over-prev' : ''}`}
                      >
                        <div 
                          className={`dll-node-capsule ${draggedDLLNodeIdx === idx ? 'dragging' : ''} ${dragOverDLLNodeIdx === idx ? 'drag-over' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStartDLL(e, idx)}
                          onDragOver={(e) => handleDragOverDLL(e, idx)}
                          onDragEnd={handleDragEndDLL}
                          onDrop={(e) => handleDropDLL(e, idx)}
                        >
                          <div className="node-ptr-sec dll-prev-ptr">
                            <div className="pointer-dot" style={{ background: '#f59e0b' }}></div>
                            <span className="dll-ptr-label">prev</span>
                          </div>
                          <div className="node-val-sec">{node.val}</div>
                          <div className="node-ptr-sec dll-next-ptr">
                            <div className="pointer-dot"></div>
                            <span className="dll-ptr-label">next</span>
                          </div>
                        </div>

                        {idx < doublyList.length - 1 && (
                          <svg className="node-arrow-svg dll-arrow-svg" viewBox="0 0 50 30">
                            <line x1="2" y1="10" x2="42" y2="10" stroke="#06b6d4" strokeWidth="2" />
                            <polygon points="42,6 50,10 42,14" fill="#06b6d4" />
                            <line x1="48" y1="20" x2="8" y2="20" stroke="#f59e0b" strokeWidth="2" />
                            <polygon points="8,16 0,20 8,24" fill="#f59e0b" />
                          </svg>
                        )}
                      </div>
                    ))}
                    
                    {doublyList.length === 0 && (
                      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                        Empty Doubly Linked List
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- 5. BINARY SEARCH TREE CANVAS --- */}
              {activeStructure === 'binarytree' && (
                <div className="tree-canvas">
                  <svg className="tree-svg-overlay" style={{ height: `${Math.max(280, (Math.max(...Object.keys(bstNodes).map(k => k.length - 4), 0) + 1) * 55 + 40)}px` }}>
                    {/* SVG lines between parent and children */}
                    {Object.keys(bstNodes).filter(key => key !== 'root' && bstNodes[key] !== null && bstNodes[key] !== undefined).map(key => {
                      const parent = key.slice(0, -1)
                      if (bstNodes[parent] !== null && bstNodes[parent] !== undefined) {
                        const pPos = getBstNodePos(parent)
                        const cPos = getBstNodePos(key)
                        return (
                          <line 
                            key={key} 
                            x1={`${pPos.x}%`} 
                            y1={pPos.y} 
                            x2={`${cPos.x}%`} 
                            y2={cPos.y} 
                            stroke="#06b6d4" 
                            strokeWidth="1.5" 
                            opacity="0.6" 
                          />
                        )
                      }
                      return null
                    })}
                  </svg>

                  {/* Render node circles */}
                  {Object.keys(bstNodes).filter(key => bstNodes[key] !== null && bstNodes[key] !== undefined).map(key => {
                    const pos = getBstNodePos(key)
                    return (
                      <div 
                        key={key} 
                        className={`tree-node-item ${bstHighlight.includes(key) ? 'highlight' : ''} ${bstRecent === key ? 'recent' : ''}`} 
                        style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
                      >
                        {bstNodes[key]}
                      </div>
                    )
                  })}
                  
                  {/* Dynamic scroll spacer to trigger overflow container scrolling */}
                  <div style={{ height: `${Math.max(280, (Math.max(...Object.keys(bstNodes).map(k => k.length - 4), 0) + 1) * 55 + 40)}px`, width: '100%' }}></div>
                  
                  {Object.keys(bstNodes).filter(key => bstNodes[key] !== null && bstNodes[key] !== undefined).length === 0 && (
                    <div style={{ position: 'absolute', width: '100%', textAlign: 'center', top: '45%', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
                      Binary Search Tree Empty
                    </div>
                  )}
                </div>
              )}

              {/* Console log for structures */}
              <div className="dsa-console-log" style={{ borderTop: '1px solid var(--border-slate)', borderRadius: '0 0 12px 12px', background: 'rgba(9, 13, 22, 0.7)' }}>
                <span>Console: <strong style={{ color: '#fff' }}>{structureLog}</strong></span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-container">
        <span className="section-subtitle">04 . Works</span>
        <h2 className="section-title">Featured Projects</h2>

        <div className="projects-grid">
          {/* Project 1 */}
          <div className="project-card glass-panel">
            <div className="project-thumbnail">
              <div className="project-code-art">
{`// AlgoVisuals React Platform
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
}`}
              </div>
            </div>
            <div className="project-body">
              <h3 className="project-title">AlgoVisuals Platform</h3>
              <p className="project-desc">
                An algorithm animation workspace implementing pathfinding solvers (Dijkstra, A*), searching loops, and sorting algorithms.
              </p>
              <div className="project-tags">
                <span className="project-tag">ReactJS</span>
                <span className="project-tag">DSA</span>
                <span className="project-tag">CSS Grid</span>
              </div>
              <div className="project-footer">
                <a href="http://github.com/Mohammed-Siddique-I" target="_blank" rel="noopener noreferrer" className="btn-neon" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  View Code
                </a>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-card glass-panel">
            <div className="project-thumbnail">
              <div className="project-code-art">
{`# DevConnect Backend Core
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  skills: [String],
  createdAt: { type: Date, default: Date.now }
});`}
              </div>
            </div>
            <div className="project-body">
              <h3 className="project-title">DevConnect Platform</h3>
              <p className="project-desc">
                A social networking database API and custom server routing enabling developers to connect, discuss issues, and share portfolios.
              </p>
              <div className="project-tags">
                <span className="project-tag">NodeJS</span>
                <span className="project-tag">MongoDB</span>
                <span className="project-tag">Express</span>
              </div>
              <div className="project-footer">
                <a href="http://github.com/Mohammed-Siddique-I" target="_blank" rel="noopener noreferrer" className="btn-neon" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  View Code
                </a>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="project-card glass-panel">
            <div className="project-thumbnail">
              <div className="project-code-art">
{`-- SQL Database Workbench
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  major VARCHAR(50),
  gpa DECIMAL(3,2)
);
SELECT name, gpa FROM students 
WHERE major = 'CSE' ORDER BY gpa DESC;`}
              </div>
            </div>
            <div className="project-body">
              <h3 className="project-title">QueryForge Editor</h3>
              <p className="project-desc">
                A graphic application to model relational database systems, validate SQL commands, and visualize schema mapping layouts.
              </p>
              <div className="project-tags">
                <span className="project-tag">MySQL</span>
                <span className="project-tag">Python</span>
                <span className="project-tag">DSA</span>
              </div>
              <div className="project-footer">
                <a href="http://github.com/Mohammed-Siddique-I" target="_blank" rel="noopener noreferrer" className="btn-neon" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  View Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-container">
        <span className="section-subtitle">05 . Connectivity</span>
        <h2 className="section-title">Get In Touch</h2>

        <div className="contact-grid">
          <div className="contact-info-block">
            <div className="contact-info-card glass-panel">
              <div className="contact-info-title">CURRENT STATUS</div>
              <div className="contact-info-value">Open to internship roles & collaborative open-source projects</div>
            </div>
            
            <div className="contact-info-card glass-panel">
              <div className="contact-info-title">EMAIL DIRECTORY</div>
              <div className="contact-info-value">
                <a href="mailto:siddique@example.com">siddique.dev@example.com</a>
              </div>
            </div>

            <div className="contact-info-card glass-panel">
              <div className="contact-info-title">GITHUB REPOSITORY</div>
              <div className="contact-info-value">
                <a href="http://github.com/Mohammed-Siddique-I" target="_blank" rel="noopener noreferrer">
                  github.com/Mohammed-Siddique-I
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-panel glass-panel">
            {/* Form Success Overlay */}
            <div className={`contact-success ${formSubmitted ? 'active' : ''}`}>
              <div className="success-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem' }}>Message Transmitted!</h3>
              <p>Thank you, Mohammed will get back to you shortly.</p>
              <button 
                className="btn-neon" 
                onClick={() => setFormSubmitted(false)}
                style={{ marginTop: '16px' }}
              >
                Send Another
              </button>
            </div>

            {/* Real Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="Your Name" 
                />
                {errors.name && <div className="validation-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="you@example.com" 
                />
                {errors.email && <div className="validation-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5" 
                  className="form-input" 
                  placeholder="Describe your project, role, or questions..."
                ></textarea>
                {errors.message && <div className="validation-error">{errors.message}</div>}
              </div>

              <button 
                type="submit" 
                className="btn-neon-filled" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-text">
            &copy; {new Date().getFullYear()} Mohammed Siddique. All Rights Reserved.
          </span>
          <div className="footer-socials">
            <a 
              href="http://github.com/Mohammed-Siddique-I" 
              className="social-icon-btn" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a 
              href="mailto:siddique.dev@example.com" 
              className="social-icon-btn"
              aria-label="Email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
