import { Dialog, DialogContent } from '../ui/dialog'

function AddQuestionModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>
            add question
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddQuestionModal
