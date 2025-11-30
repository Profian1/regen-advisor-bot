import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PlanStep {
  action: string;
  time: string;
  materials: string;
  cost: string;
}

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: PlanStep[];
}

export const CalendarDialog = ({ open, onOpenChange, steps }: CalendarDialogProps) => {
  const [stepDates, setStepDates] = useState<Record<number, Date>>({});

  const handleDateSelect = (stepIndex: number, date: Date | undefined) => {
    if (date) {
      setStepDates(prev => ({ ...prev, [stepIndex]: date }));
    }
  };

  const generateICS = () => {
    const selectedSteps = Object.entries(stepDates);
    
    if (selectedSteps.length === 0) {
      toast.error("Please select at least one date for your action steps");
      return;
    }

    // Generate ICS file content
    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AgroSense//Regenerative Agriculture Advisor//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:AgroSense Action Plan",
      "X-WR-TIMEZONE:UTC",
    ];

    selectedSteps.forEach(([indexStr, date]) => {
      const index = parseInt(indexStr);
      const step = steps[index];
      
      // Format date for ICS (YYYYMMDD)
      const dateStr = format(date, "yyyyMMdd");
      const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
      
      // Create unique ID
      const uid = `agrosense-step-${index}-${Date.now()}@agrosense.app`;
      
      icsContent.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `SUMMARY:Step ${index + 1}: ${step.action}`,
        `DESCRIPTION:${step.action}\\n\\nTime Required: ${step.time || 'N/A'}\\nMaterials: ${step.materials || 'N/A'}\\nEstimated Cost: ${step.cost || 'N/A'}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "BEGIN:VALARM",
        "TRIGGER:-PT24H",
        "ACTION:DISPLAY",
        `DESCRIPTION:Reminder: ${step.action}`,
        "END:VALARM",
        "END:VEVENT"
      );
    });

    icsContent.push("END:VCALENDAR");

    // Create blob and download
    const blob = new Blob([icsContent.join("\r\n")], { 
      type: "text/calendar;charset=utf-8" 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agrosense-action-plan-${format(new Date(), "yyyy-MM-dd")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${selectedSteps.length} event(s) added to calendar file`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Your Action Plan</DialogTitle>
          <DialogDescription>
            Select dates for each step you want to add to your calendar. Each event will include a 24-hour reminder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {step.action}
                    </h4>
                    {step.time && (
                      <p className="text-xs text-muted-foreground">
                        Time needed: {step.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[200px] justify-start text-left font-normal",
                      !stepDates[index] && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {stepDates[index] ? (
                      format(stepDates[index], "MMM dd, yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={stepDates[index]}
                    onSelect={(date) => handleDateSelect(index, date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
          <Button 
            onClick={generateICS}
            className="flex-1"
            disabled={Object.keys(stepDates).length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Calendar File ({Object.keys(stepDates).length} events)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          The .ics file works with Google Calendar, Apple Calendar, Outlook, and most calendar apps
        </p>
      </DialogContent>
    </Dialog>
  );
};
